package com.polls.pojos.repository;

import com.polls.pojos.Poll;
import com.polls.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {

    List<Poll> findByCreatedBy(User user);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Poll p JOIN Vote v ON p.id = v.poll.id WHERE v.user.id = :userId")
    List<Poll> findVotedPollsByUserId(Long userId);
}
