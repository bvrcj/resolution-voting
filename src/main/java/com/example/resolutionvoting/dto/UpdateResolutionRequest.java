package com.example.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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
}
