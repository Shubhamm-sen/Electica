package com.polls.pojos.serviceImpl;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.polls.pojos.Poll;
import com.polls.pojos.PollOption;
import com.polls.pojos.User;
import com.polls.pojos.dto.CreatePollRequestDTO;
import com.polls.pojos.dto.MyPollDTO;
import com.polls.pojos.dto.PollOptionDTO;
import com.polls.pojos.dto.PollResponseDTO;
import com.polls.pojos.exception.BusinessException;
import com.polls.pojos.exception.ResourceNotFoundException;

import com.polls.pojos.repository.PollRepository;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.service.PollService;

@Service
@Transactional
public class PollServiceImpl implements PollService {

    private final PollRepository pollRepository;

    private final UserRepository userRepository;

    private final com.polls.pojos.repository.VoteRepository voteRepository;

    public PollServiceImpl(PollRepository pollRepository,
            UserRepository userRepository,
            com.polls.pojos.repository.VoteRepository voteRepository) {
        this.pollRepository = pollRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    // ================= CREATE POLL =================

    @Override
    public PollResponseDTO createPoll(CreatePollRequestDTO request) {

        if (request.getQuestion() == null || request.getQuestion().isBlank()) {
            throw new BusinessException("Poll question is required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id " + request.getUserId()));

        if (request.getOptions() == null || request.getOptions().size() < 2) {
            throw new BusinessException("At least 2 options are required");
        }

        Poll poll = new Poll();
        poll.setQuestion(request.getQuestion());
        poll.setCreatedBy(user);
        poll.setClosed(false);

        if (request.getExpiryTime() != null) {
            poll.setExpiryTime(request.getExpiryTime());
        } else {
            poll.setExpiryTime(LocalDateTime.now().plusDays(7));
        }

        List<PollOption> options = request.getOptions()
                .stream()
                .map(text -> {
                    PollOption option = new PollOption();
                    option.setOptionText(text);
                    option.setPoll(poll);
                    return option;
                })
                .toList();

        poll.setOptions(options);

        Poll savedPoll = pollRepository.save(poll);

        return mapToDTO(savedPoll);
    }

    // ================= GET POLL BY ID =================
    @Override
    public PollResponseDTO getPollById(Long pollId) {
        return getPollById(pollId, null);
    }

    @Override
    public PollResponseDTO getPollById(Long pollId, Long userId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id " + pollId));

        // Close if expired
        if (!poll.getClosed() && poll.getExpiryTime() != null && poll.getExpiryTime().isBefore(LocalDateTime.now())) {
            poll.setClosed(true);
            pollRepository.save(poll);
        }

        PollResponseDTO dto = mapToDTO(poll);

        if (userId != null) {
            boolean hasVoted = voteRepository.existsByUserIdAndPollId(userId, pollId);
            dto.setHasVoted(hasVoted);
        }

        return dto;
    }

    // ================= GET ALL POLLS =================
    @Override
    public List<PollResponseDTO> getAllPolls() {

        return pollRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<MyPollDTO> getPollsVotedByUser(Long userId) {
        List<Poll> polls = pollRepository.findVotedPollsByUserId(userId);
        return polls.stream()
                .map(this::mapToMyPollDTO)
                .toList();
    }

    // ================= GET POLLS BY USER =================
    @Override
    public List<MyPollDTO> getPollsByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        return pollRepository.findByCreatedBy(user)
                .stream()
                .map(this::mapToMyPollDTO)
                .toList();
    }

    private MyPollDTO mapToMyPollDTO(Poll poll) {
        MyPollDTO dto = new MyPollDTO();
        dto.setId(poll.getId());
        dto.setQuestion(poll.getQuestion());

        dto.setExpiryTime(poll.getExpiryTime());
        dto.setClosed(poll.getClosed());
        dto.setCreatedAt(poll.getCreatedAt());

        // Vote Count
        long count = 0;
        if (poll.getOptions() != null) {
            count = voteRepository.countByPollId(poll.getId());
        }
        dto.setVoteCount(count);

        return dto;
    }

    // ================= DTO MAPPER =================
    private PollResponseDTO mapToDTO(Poll poll) {

        PollResponseDTO dto = new PollResponseDTO();
        dto.setId(poll.getId());
        dto.setQuestion(poll.getQuestion());
        dto.setExpiryTime(poll.getExpiryTime());

        List<PollOptionDTO> options = poll.getOptions()
                .stream()
                .map(option -> {
                    PollOptionDTO o = new PollOptionDTO();
                    o.setId(option.getId());
                    o.setOptionText(option.getOptionText());
                    // Assuming PollOption has a collection of votes "getVotes()"
                    // If PollOption doesn't have getVotes yet (need to check), we might need to add
                    // it or fetch count differently.
                    // Based on previous assumptions, PollOption usually has OneToMany List<Vote>
                    // votes;
                    o.setVoteCount(option.getVotes() != null ? (long) option.getVotes().size() : 0L);
                    return o;
                })
                .toList();

        dto.setOptions(options);

        // Calculate total votes
        long totalVotes = options.stream()
                .mapToLong(PollOptionDTO::getVoteCount)
                .sum();
        dto.setTotalVotes(totalVotes);

        if (poll.getCreatedBy() != null) {
            dto.setCreatedBy(poll.getCreatedBy().getUsername());
        }

        return dto;
    }

    @Override
    public PollResponseDTO closePoll(Long pollId, Long userId) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        boolean isCreator = poll.getCreatedBy().getId().equals(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isCreator && !isAdmin) {
            throw new BusinessException("Not authorized to close this poll");
        }

        if (Boolean.TRUE.equals(poll.getClosed())) {
            throw new BusinessException("Poll is already closed");
        }

        poll.setClosed(true);
        return mapToDTO(pollRepository.save(poll));
    }

    @Override
    public PollResponseDTO updateExpiry(Long pollId, Long userId, LocalDateTime expiryTime) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        boolean isCreator = poll.getCreatedBy().getId().equals(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isCreator && !isAdmin) {
            throw new BusinessException("Not authorized to update expiry");
        }

        if (Boolean.TRUE.equals(poll.getClosed())) {
            throw new BusinessException("Cannot update expiry for a closed poll");
        }

        if (expiryTime == null) {
            throw new BusinessException("Expiry time cannot be null");
        }

        if (expiryTime.isBefore(LocalDateTime.now())) {
            throw new BusinessException("Expiry time must be in the future");
        }

        poll.setExpiryTime(expiryTime);
        return mapToDTO(pollRepository.save(poll));
    }

    @Override
    public void deletePoll(Long pollId, Long userId) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        boolean isCreator = poll.getCreatedBy().getId().equals(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isCreator && !isAdmin) {
            throw new BusinessException("Not authorized to delete this poll");
        }

        // prevent delete if votes exist
        if (!poll.getVotes().isEmpty()) {
            throw new BusinessException("Cannot delete poll after votes are cast");
        }

        pollRepository.delete(poll);
    }

}
