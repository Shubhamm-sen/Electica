package com.polls.pojos.service;

import com.polls.pojos.Vote;
import com.polls.pojos.dto.PollResultResponseDTO;
import com.polls.pojos.dto.VoteResponseDTO;

public interface VoteService {

    // Cast vote
	VoteResponseDTO castVote(Vote vote);


    // Get poll results
	 PollResultResponseDTO getPollResults(Long pollId);


    public void deleteVote(Long pollId, Long userId);
    
   


}
