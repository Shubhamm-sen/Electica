package com.polls.pojos;

import jakarta.persistence.*;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "votes",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"poll_id", "user_id"}) // one user can vote once per poll
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @PrePersist
    public void onVote() {
        this.votedAt = LocalDateTime.now();
    }


    // Many votes belong to one poll
    @ManyToOne
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    // Many votes select one option
    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private PollOption option;

    // Many votes are cast by one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
