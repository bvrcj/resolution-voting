package com.example.resolutionvoting.controller;

import com.example.resolutionvoting.dto.CreateRoomRequest;
import com.example.resolutionvoting.dto.RoomResponse;
import com.example.resolutionvoting.dto.UpdateRoomRequest;
import com.example.resolutionvoting.model.Room;
import com.example.resolutionvoting.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Rooms", description = "Manage rooms used for resolution voting.")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create room", description = "Creates a new room.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Room created",
                    content = @Content(schema = @Schema(implementation = RoomResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public RoomResponse createRoom(@Valid @RequestBody CreateRoomRequest request) {
        Room room = new Room(request.getName(), request.getLatitude(), request.getLongitude());
        return RoomResponse.from(roomRepository.save(room));
    }

    @GetMapping
    @Operation(summary = "List rooms", description = "Returns all rooms.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of rooms",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = RoomResponse.class))))
    })
    public List<RoomResponse> listRooms() {
        return roomRepository.findAll().stream().map(RoomResponse::from).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room", description = "Returns a room by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room found",
                    content = @Content(schema = @Schema(implementation = RoomResponse.class))),
            @ApiResponse(responseCode = "404", description = "Room not found")
    })
    public RoomResponse getRoom(@PathVariable Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));
        return RoomResponse.from(room);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update room", description = "Updates a room by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room updated",
                    content = @Content(schema = @Schema(implementation = RoomResponse.class))),
            @ApiResponse(responseCode = "404", description = "Room not found")
    })
    public RoomResponse updateRoom(@PathVariable Long id, @Valid @RequestBody UpdateRoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));
        room.setName(request.getName());
        room.setLatitude(request.getLatitude());
        room.setLongitude(request.getLongitude());
        return RoomResponse.from(roomRepository.save(room));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete room", description = "Deletes a room by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Room deleted"),
            @ApiResponse(responseCode = "404", description = "Room not found")
    })
    public void deleteRoom(@PathVariable Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Room not found");
        }
        roomRepository.deleteById(id);
    }
}
