package com.lsvt.resolutionvoting.dto;

import com.lsvt.resolutionvoting.model.VoteChoice;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(name = "VoteRequest", description = "Payload to cast a vote.")
public class VoteRequest {

    @NotNull
    @Positive
    @Schema(example = "2")
    private Long voterId;

    @Schema(example = "null", description = "User id being represented by proxy (optional).")
    @Positive
    private Long proxyForUserId;

    @NotNull
    @Schema(example = "FOR", description = "Vote choice: FOR, AGAINST, ABSTAIN.")
    private VoteChoice choice;

    @NotNull
    @DecimalMin(value = "-90.0")
    @DecimalMax(value = "90.0")
    @Schema(example = "12.9716", description = "Latitude of the voter location.")
    private Double latitude;

    @NotNull
    @DecimalMin(value = "-180.0")
    @DecimalMax(value = "180.0")
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

