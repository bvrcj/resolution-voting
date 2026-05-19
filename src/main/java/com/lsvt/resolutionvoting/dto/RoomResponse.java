package com.lsvt.resolutionvoting.dto;

import com.lsvt.resolutionvoting.model.Room;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(name = "RoomResponse", description = "Room details.")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {

    @Schema(example = "1")
    private Long id;
    @Schema(example = "Board Room A")
    private String name;
    @Schema(example = "12.9716")
    private Double latitude;
    @Schema(example = "77.5946")
    private Double longitude;

    public static RoomResponse from(Room room) {
        return new RoomResponse(room.getId(), room.getName(), room.getLatitude(), room.getLongitude());
    }
}

