package com.polls.pojos.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.polls.pojos.Poll;
import com.polls.pojos.PollOption;
import com.polls.pojos.User;
import com.polls.pojos.dto.MyPollDTO;
import com.polls.pojos.dto.PollOptionDTO;
import com.polls.pojos.dto.PollResponseDTO;
import com.polls.pojos.exception.BusinessException;
import com.polls.pojos.exception.ResourceNotFoundException;
import com.polls.pojos.repository.PollOptionRepository;
import com.polls.pojos.repository.PollRepository;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.service.PollService;

@Service
@Transactional
public class PollServiceImpl implements PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final UserRepository userRepository;

    public PollServiceImpl(PollRepository pollRepository,
                           PollOptionRepository pollOptionRepository,
                           UserRepository userRepository) {
        this.pollRepository = pollRepository;
        this.pollOptionRepository = pollOptionRepository;
        this.userRepository = userRepository;
    }

    // ================= CREATE POLL =================
    @Override
    public PollResponseDTO createPoll(Poll poll) {

        User user = userRepository.findById(poll.getCreatedBy().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id " + poll.getCreatedBy().getId()));

        poll.setCreatedBy(user);

        // default expiry = 7 days
        if (poll.getExpiryTime() == null) {
            poll.setExpiryTime(LocalDateTime.now().plusDays(7));
        }

        Poll savedPoll = pollRepository.save(poll);

        for (PollOption option : poll.getOptions()) {
            option.setPoll(savedPoll);
            pollOptionRepository.save(option);
        }

        return mapToDTO(savedPoll);
    }

    // ================= GET POLL BY ID =================
    @Override
    public PollResponseDTO getPollById(Long pollId) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        return mapToDTO(poll);
    }

    // ================= GET ALL POLLS =================
    @Override
    public List<PollResponseDTO> getAllPolls() {

        return pollRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= GET POLLS BY USER =================
    @Override
    public List<MyPollDTO> getPollsByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

        return pollRepository.findByCreatedBy(user)
                .stream()
                .map(poll -> {
                    MyPollDTO dto = new MyPollDTO();
                    dto.setId(poll.getId());
                    dto.setQuestion(poll.getQuestion());
                    return dto;
                })
                .toList();
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
                    return o;
                })
                .toList();

        dto.setOptions(options);
        return dto;
    }
    @Override
    public PollResponseDTO closePoll(Long pollId, Long userId) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

        boolean isCreator = poll.getCreatedBy().getId().equals(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isCreator && !isAdmin) {
            throw new BusinessException("Not authorized to close this poll");
        }

        if (poll.isClosed()) {
            throw new BusinessException("Poll is already closed");
        }

        poll.setClosed(true);
        return mapToDTO(pollRepository.save(poll));
    }

    
    @Override
    public PollResponseDTO updateExpiry(Long pollId, Long userId, LocalDateTime expiryTime) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

        boolean isCreator = poll.getCreatedBy().getId().equals(userId);
        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isCreator && !isAdmin) {
            throw new BusinessException("Not authorized to update expiry");
        }

        if (poll.isClosed()) {
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
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

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
