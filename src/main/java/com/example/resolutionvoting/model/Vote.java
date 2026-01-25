package com.example.resolutionvoting.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(
        name = "votes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"resolution_id", "effective_voter_id"})
)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resolution_id", nullable = false)
    private Resolution resolution;

    @ManyToOne(optional = false)
    @JoinColumn(name = "voter_id", nullable = false)
    private User voter;

    @ManyToOne
    @JoinColumn(name = "proxy_for_user_id")
    private User proxyFor;

    @ManyToOne(optional = false)
    @JoinColumn(name = "effective_voter_id", nullable = false)
    private User effectiveVoter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteChoice choice;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Vote() {
    }

    public Vote(Resolution resolution, User voter, User proxyFor, User effectiveVoter, VoteChoice choice) {
        this.resolution = resolution;
        this.voter = voter;
        this.proxyFor = proxyFor;
        this.effectiveVoter = effectiveVoter;
        this.choice = choice;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public User getVoter() {
        return voter;
    }

    public User getProxyFor() {
        return proxyFor;
    }

    public User getEffectiveVoter() {
        return effectiveVoter;
    }

    public VoteChoice getChoice() {
        return choice;
    }

    public void setChoice(VoteChoice choice) {
        this.choice = choice;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
