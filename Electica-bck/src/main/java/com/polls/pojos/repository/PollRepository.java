package com.polls.pojos.repository;

import com.polls.pojos.Poll;
import com.polls.pojos.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PollRepository extends JpaRepository<Poll, Long> {

    List<Poll> findByCreatedBy(User user);
}
