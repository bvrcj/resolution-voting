package com.example.resolutionvoting.dto;

import com.example.resolutionvoting.model.Room;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "RoomResponse", description = "Room details.")
public class RoomResponse {

    @Schema(example = "1")
    private Long id;
    @Schema(example = "Board Room A")
    private String name;
    @Schema(example = "12.9716")
    private Double latitude;
    @Schema(example = "77.5946")
    private Double longitude;

    public RoomResponse(Long id, String name, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static RoomResponse from(Room room) {
        return new RoomResponse(room.getId(), room.getName(), room.getLatitude(), room.getLongitude());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
}
