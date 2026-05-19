package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.Instant;

@Schema(name = "UpdateResolutionRequest", description = "Payload to update a draft resolution.")
public class UpdateResolutionRequest {

    @NotBlank
    @Schema(example = "Adopt new voting policy (revised)")
    private String title;

    @Schema(example = "Adopt the updated voting policy for the board.")
    private String description;

    @NotNull
    @Positive
    @Schema(example = "1", description = "Room id where this resolution is being voted.")
    private Long roomId;

    @Schema(example = "2026-02-16T15:00:00Z", description = "Scheduled publish date/time.")
    private Instant publishAt;

    @Schema(example = "2026-02-17T15:00:00Z", description = "Scheduled voting start date/time.")
    private Instant votingStartAt;

    @Schema(example = "2026-02-18T15:00:00Z", description = "Scheduled voting end date/time.")
    private Instant votingEndAt;

    @Schema(example = "1", description = "Primary purpose person user ID.")
    private Long primaryPurposePersonId;

    @Schema(example = "2", description = "Secondary purpose person user ID.")
    private Long secondaryPurposePersonId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Instant getPublishAt() {
        return publishAt;
    }

    public void setPublishAt(Instant publishAt) {
        this.publishAt = publishAt;
    }

    public Instant getVotingStartAt() {
        return votingStartAt;
    }

    public void setVotingStartAt(Instant votingStartAt) {
        this.votingStartAt = votingStartAt;
    }

    public Instant getVotingEndAt() {
        return votingEndAt;
    }

    public void setVotingEndAt(Instant votingEndAt) {
        this.votingEndAt = votingEndAt;
    }

    public Long getPrimaryPurposePersonId() {
        return primaryPurposePersonId;
    }

    public void setPrimaryPurposePersonId(Long primaryPurposePersonId) {
        this.primaryPurposePersonId = primaryPurposePersonId;
    }

    public Long getSecondaryPurposePersonId() {
        return secondaryPurposePersonId;
    }

    public void setSecondaryPurposePersonId(Long secondaryPurposePersonId) {
        this.secondaryPurposePersonId = secondaryPurposePersonId;
    }
}

