package com.polls.pojos.dto;

public class MyPollDTO {

    private Long id;
    private String question;

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

    private Long voteCount;
    private java.time.LocalDateTime expiryTime;
    private Boolean closed;
    private java.time.LocalDateTime createdAt;

    public Long getVoteCount() {
        return voteCount;
    }

    public void setVoteCount(Long voteCount) {
        this.voteCount = voteCount;
    }

    public java.time.LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(java.time.LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public Boolean getClosed() {
        return closed;
    }

    public void setClosed(Boolean closed) {
        this.closed = closed;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
