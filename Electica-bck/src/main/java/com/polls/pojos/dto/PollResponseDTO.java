package com.polls.pojos.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PollResponseDTO {

    private Long id;
    private String question;
    private LocalDateTime expiryTime;
    private List<PollOptionDTO> options;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public List<PollOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<PollOptionDTO> options) {
        this.options = options;
    }
}
