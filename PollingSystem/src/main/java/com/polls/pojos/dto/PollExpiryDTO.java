package com.polls.pojos.dto;

import java.time.LocalDateTime;

public class PollExpiryDTO {

    private LocalDateTime expiryTime;

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
}
