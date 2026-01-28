package com.polls.pojos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.polls.pojos.Vote;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    long countByPollId(Long pollId);

    long countByPollIdAndOptionId(Long pollId, Long optionId);

    boolean existsByUserIdAndPollId(Long userId, Long pollId);
    
    Optional<Vote> findByPollIdAndUserId(Long pollId, Long userId);

}
