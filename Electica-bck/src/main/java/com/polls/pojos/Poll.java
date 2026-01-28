package com.polls.pojos;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "polls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String question;

    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private boolean closed = false;

 
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    // Many polls are created by one user
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    // One poll has many options
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<PollOption> options;
  
    // One poll can have many votes
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Vote> votes;
    



}
