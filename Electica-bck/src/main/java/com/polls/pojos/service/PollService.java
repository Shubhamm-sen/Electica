package com.polls.pojos.service;

import java.time.LocalDateTime;
import java.util.List;

import com.polls.pojos.Poll;
import com.polls.pojos.dto.MyPollDTO;
import com.polls.pojos.dto.PollResponseDTO;

public interface PollService {

    // CREATE poll (POST)
	PollResponseDTO createPoll(Poll poll);


    // GET poll by id (DTO)
    PollResponseDTO getPollById(Long pollId);

    // GET polls created by a user (DTO)
    List<MyPollDTO> getPollsByUser(Long userId);
    
    List<PollResponseDTO> getAllPolls();
    
    PollResponseDTO closePoll(Long pollId, Long userId);
    
    PollResponseDTO updateExpiry(Long pollId, Long userId, LocalDateTime expiryTime);

    void deletePoll(Long pollId, Long userId);




}
