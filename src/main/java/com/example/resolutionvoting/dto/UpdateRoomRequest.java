package com.example.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "UpdateRoomRequest", description = "Payload to update a room.")
public class UpdateRoomRequest {

    @NotBlank
    @Schema(example = "Board Room A")
    private String name;

    @NotNull
    @Schema(example = "12.9716")
    private Double latitude;

    @NotNull
    @Schema(example = "77.5946")
    private Double longitude;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
