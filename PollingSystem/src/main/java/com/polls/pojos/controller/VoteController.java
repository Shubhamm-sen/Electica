package com.polls.pojos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.polls.pojos.Poll;
import com.polls.pojos.Vote;

import com.polls.pojos.dto.PollResultResponseDTO;
import com.polls.pojos.dto.VoteResponseDTO;
import com.polls.pojos.service.VoteService;

@RestController
@RequestMapping("/api/polls")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    // CAST VOTE
    @PostMapping("/{pollId}/vote")
    public ResponseEntity<VoteResponseDTO> castVote(
            @PathVariable Long pollId,
            @RequestBody Vote vote) {

        // 🔒 enforce pollId from URL
        if (vote.getPoll() == null) {
            vote.setPoll(new Poll());
        }
        vote.getPoll().setId(pollId);

        return ResponseEntity.ok(voteService.castVote(vote));
    }

    // GET POLL RESULTS
    @GetMapping("/{pollId}/results")
    public ResponseEntity<PollResultResponseDTO> getPollResults(
            @PathVariable Long pollId) {

        return ResponseEntity.ok(voteService.getPollResults(pollId));
    }

    @DeleteMapping("/{pollId}/vote")
    public ResponseEntity<String> deleteVote(
            @PathVariable Long pollId,
            @RequestParam Long userId) {

        voteService.deleteVote(pollId, userId);
        return ResponseEntity.ok("Vote deleted successfully");
    }

}
