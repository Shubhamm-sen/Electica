package com.polls.pojos.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.polls.pojos.Poll;
import com.polls.pojos.PollOption;
import com.polls.pojos.User;
import com.polls.pojos.Vote;
import com.polls.pojos.dto.PollResultDTO;
import com.polls.pojos.dto.PollResultResponseDTO;
import com.polls.pojos.dto.VoteResponseDTO;
import com.polls.pojos.exception.BusinessException;
import com.polls.pojos.exception.ResourceNotFoundException;
import com.polls.pojos.repository.PollOptionRepository;
import com.polls.pojos.repository.PollRepository;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.repository.VoteRepository;
import com.polls.pojos.service.VoteService;

@Service
@Transactional
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;

    public VoteServiceImpl(
            VoteRepository voteRepository,
            UserRepository userRepository,
            PollRepository pollRepository,
            PollOptionRepository pollOptionRepository) {

        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
        this.pollRepository = pollRepository;
        this.pollOptionRepository = pollOptionRepository;
    }

    // ================= CAST VOTE =================
    @Override
    public VoteResponseDTO castVote(Vote vote) {

        Long userId = vote.getUser().getId();
        Long pollId = vote.getPoll().getId();
        Long optionId = vote.getOption().getId();

        // 1️ Validate user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

        // 2️ Validate poll
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        // 3️ Prevent vote if poll closed
        if (Boolean.TRUE.equals(poll.getClosed())) {
            throw new BusinessException("Poll is already closed");
        }

        // 4️ Prevent vote after expiry (NULL safe)
        if (poll.getExpiryTime() != null &&
                poll.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Voting time has expired");
        }

        // 5️ Validate option
        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Option not found with id " + optionId));

        if (!option.getPoll().getId().equals(pollId)) {
            throw new BusinessException("Option does not belong to this poll");
        }

        // 6️⃣ Prevent duplicate vote
        if (voteRepository.existsByUserIdAndPollId(userId, pollId)) {
            throw new BusinessException("User has already voted");
        }

        // 7️⃣ Save vote
        vote.setUser(user);
        vote.setPoll(poll);
        vote.setOption(option);

        Vote savedVote = voteRepository.save(vote);

        VoteResponseDTO dto = new VoteResponseDTO();
        dto.setId(savedVote.getId());
        dto.setMessage("Vote cast successfully");

        return dto;
    }

    // ================= GET POLL RESULTS =================
    @Override
    public PollResultResponseDTO getPollResults(Long pollId) {

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        long totalVotes = voteRepository.countByPollId(pollId);

        List<PollResultDTO> results = poll.getOptions()
                .stream()
                .map(option -> {

                    long optionVotes =
                            voteRepository.countByPollIdAndOptionId(pollId, option.getId());

                    double percentage = totalVotes == 0
                            ? 0.0
                            : (optionVotes * 100.0) / totalVotes;

                    PollResultDTO dto = new PollResultDTO();
                    dto.setOptionId(option.getId());
                    dto.setOptionText(option.getOptionText());
                    dto.setVoteCount(optionVotes);
                    dto.setPercentage(Math.round(percentage * 100.0) / 100.0);

                    return dto;
                })
                .toList();

        PollResultResponseDTO response = new PollResultResponseDTO();
        response.setPollId(poll.getId());
        response.setQuestion(poll.getQuestion());
        response.setTotalVotes(totalVotes);
        response.setResults(results);

        return response;
    }
    @Override
    public void deleteVote(Long pollId, Long userId) {

        // 1️ Check poll exists
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Poll not found with id " + pollId));

        // 2️ Prevent delete if poll is closed
        if (Boolean.TRUE.equals(poll.getClosed())) {
            throw new BusinessException("Cannot delete vote after poll is closed");
        }

        // 3️ Find user's vote
        Vote vote = voteRepository.findByPollIdAndUserId(pollId, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vote not found for this user"));

        // 4️ Delete vote
        voteRepository.delete(vote);
    }

}
