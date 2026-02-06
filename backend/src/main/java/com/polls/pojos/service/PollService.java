package com.polls.pojos.service;

import java.time.LocalDateTime;
import java.util.List;

import com.polls.pojos.dto.CreatePollRequestDTO;
import com.polls.pojos.dto.MyPollDTO;
import com.polls.pojos.dto.PollResponseDTO;

public interface PollService {

    PollResponseDTO createPoll(CreatePollRequestDTO request);

    PollResponseDTO getPollById(Long pollId);

    PollResponseDTO getPollById(Long pollId, Long userId);

    List<MyPollDTO> getPollsByUser(Long userId);

    List<MyPollDTO> getPollsVotedByUser(Long userId);

    List<PollResponseDTO> getAllPolls();

    PollResponseDTO closePoll(Long pollId, Long userId);

    PollResponseDTO updateExpiry(Long pollId, Long userId, LocalDateTime expiryTime);

    void deletePoll(Long pollId, Long userId);
}
