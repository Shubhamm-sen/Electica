package com.polls.pojos;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "poll_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String optionText;

    // Many options belong to one poll
    @ManyToOne
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    // One option can have many votes
    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    private List<Vote> votes;
}
