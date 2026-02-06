package com.polls.pojos.repository;

import com.polls.pojos.PollOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PollOptionRepository extends JpaRepository<PollOption, Long> {

    List<PollOption> findByPollId(Long pollId);
}

