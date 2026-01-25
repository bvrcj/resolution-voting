package com.example.resolutionvoting.dto;

import com.example.resolutionvoting.model.VoteChoice;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "VoteRequest", description = "Payload to cast a vote.")
public class VoteRequest {

    @NotNull
    @Schema(example = "2")
    private Long voterId;

    @Schema(example = "null", description = "User id being represented by proxy (optional).")
    private Long proxyForUserId;

    @NotNull
    @Schema(example = "FOR", description = "Vote choice: FOR, AGAINST, ABSTAIN.")
    private VoteChoice choice;

    @NotNull
    @Schema(example = "12.9716", description = "Latitude of the voter location.")
    private Double latitude;

    @NotNull
    @Schema(example = "77.5946", description = "Longitude of the voter location.")
    private Double longitude;

    public Long getVoterId() {
        return voterId;
    }

    public void setVoterId(Long voterId) {
        this.voterId = voterId;
    }

    public Long getProxyForUserId() {
        return proxyForUserId;
    }

    public void setProxyForUserId(Long proxyForUserId) {
        this.proxyForUserId = proxyForUserId;
    }

    public VoteChoice getChoice() {
        return choice;
    }

    public void setChoice(VoteChoice choice) {
        this.choice = choice;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
