package com.polls.pojos.dto;

import java.util.List;

public class PollResultResponseDTO {

    private Long pollId;
    private String question;
    private long totalVotes;
    private List<PollResultDTO> results;

    public Long getPollId() {
        return pollId;
    }

    public void setPollId(Long pollId) {
        this.pollId = pollId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public long getTotalVotes() {
        return totalVotes;
    }

    public void setTotalVotes(long totalVotes) {
        this.totalVotes = totalVotes;
    }

    public List<PollResultDTO> getResults() {
        return results;
    }

    public void setResults(List<PollResultDTO> results) {
        this.results = results;
    }
}
