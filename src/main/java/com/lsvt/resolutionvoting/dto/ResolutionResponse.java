package com.lsvt.resolutionvoting.dto;

import com.lsvt.resolutionvoting.model.Resolution;
import com.lsvt.resolutionvoting.model.ResolutionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(name = "ResolutionResponse", description = "Resolution details.")
public class ResolutionResponse {

    @Schema(example = "10")
    private Long id;
    @Schema(example = "Adopt new voting policy")
    private String title;
    @Schema(example = "Adopt the updated voting policy for the board.")
    private String description;
    @Schema(description = "Room where the resolution is being voted.")
    private RoomResponse room;
    @Schema(example = "DRAFT", description = "Status: DRAFT, PUBLISHED, VOTING, PROXY_VOTING, CLOSED, RESULTS_PUBLISHED.")
    private ResolutionStatus status;
    @Schema(example = "2026-01-24T01:10:00Z")
    private Instant createdAt;
    @Schema(example = "2026-01-24T01:10:00Z")
    private Instant updatedAt;
    @Schema(example = "2026-01-24T01:14:00Z")
    private Instant votingStartedAt;
    @Schema(example = "2026-01-24T01:20:00Z")
    private Instant votingEndedAt;

    public ResolutionResponse(
            Long id,
            String title,
            String description,
            RoomResponse room,
            ResolutionStatus status,
            Instant createdAt,
            Instant updatedAt,
            Instant votingStartedAt,
            Instant votingEndedAt
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.room = room;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.votingStartedAt = votingStartedAt;
        this.votingEndedAt = votingEndedAt;
    }

    public static ResolutionResponse from(Resolution resolution) {
        return new ResolutionResponse(
                resolution.getId(),
                resolution.getTitle(),
                resolution.getDescription(),
                RoomResponse.from(resolution.getRoom()),
                resolution.getStatus(),
                resolution.getCreatedAt(),
                resolution.getUpdatedAt(),
                resolution.getVotingStartedAt(),
                resolution.getVotingEndedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public ResolutionStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getVotingStartedAt() {
        return votingStartedAt;
    }

    public Instant getVotingEndedAt() {
        return votingEndedAt;
    }
}

