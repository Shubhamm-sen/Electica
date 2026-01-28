package com.polls.pojos.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.polls.pojos.Poll;
import com.polls.pojos.dto.MyPollDTO;
import com.polls.pojos.dto.PollExpiryDTO;
import com.polls.pojos.dto.PollResponseDTO;
import com.polls.pojos.service.PollService;

@RestController
@RequestMapping("/api/polls")
public class PollController {

    private final PollService pollService;

    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    // CREATE POLL (POST)

    
    @PostMapping
    public ResponseEntity<PollResponseDTO> createPoll(@RequestBody Poll poll) {
        return ResponseEntity.ok(pollService.createPoll(poll));
    }


    // GET POLL BY ID (DTO)
    @GetMapping("/{pollId}")
    public ResponseEntity<PollResponseDTO> getPollById(@PathVariable Long pollId) {
        return ResponseEntity.ok(pollService.getPollById(pollId));
    }


    // GET MY POLLS (DTO)
    @GetMapping("/my")
    public ResponseEntity<List<MyPollDTO>> getMyPolls(@RequestParam Long userId) {
        return ResponseEntity.ok(pollService.getPollsByUser(userId));
    }
    
 // GET ALL POLLS (PUBLIC)
    @GetMapping
    public ResponseEntity<List<PollResponseDTO>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }
    
    @PutMapping("/{pollId}/close")
    public ResponseEntity<PollResponseDTO> closePoll(
            @PathVariable Long pollId,
            @RequestParam Long userId) {

        return ResponseEntity.ok(pollService.closePoll(pollId, userId));
    }

  

    @PutMapping("/{pollId}/expiry")
    public ResponseEntity<PollResponseDTO> updateExpiry(
            @PathVariable Long pollId,
            @RequestParam Long userId,
            @RequestBody PollExpiryDTO dto) {

        return ResponseEntity.ok(
                pollService.updateExpiry(
                        pollId,
                        userId,
                        dto.getExpiryTime()
                )
        );
    }


    @DeleteMapping("/{pollId}")
    public ResponseEntity<String> deletePoll(
            @PathVariable Long pollId,
            @RequestParam Long userId) {

        pollService.deletePoll(pollId, userId);
        return ResponseEntity.ok("Poll deleted successfully");
    }


}
