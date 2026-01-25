package com.example.resolutionvoting.controller;

import com.example.resolutionvoting.TestUtils;
import com.example.resolutionvoting.dto.CreateRoomRequest;
import com.example.resolutionvoting.dto.UpdateRoomRequest;
import com.example.resolutionvoting.model.Room;
import com.example.resolutionvoting.repository.RoomRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RoomController.class)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RoomRepository roomRepository;

    @Test
    void create_room_success() throws Exception {
        CreateRoomRequest request = new CreateRoomRequest();
        request.setName("Room A");
        request.setLatitude(12.0);
        request.setLongitude(77.0);

        Room saved = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        when(roomRepository.save(org.mockito.ArgumentMatchers.any(Room.class))).thenReturn(saved);

        mockMvc.perform(post("/api/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Room A"));
    }

    @Test
    void create_room_validation_error() throws Exception {
        CreateRoomRequest request = new CreateRoomRequest();
        request.setLatitude(12.0);
        request.setLongitude(77.0);

        mockMvc.perform(post("/api/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void list_rooms() throws Exception {
        when(roomRepository.findAll()).thenReturn(List.of(
                TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L)
        ));

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void get_room_not_found() throws Exception {
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/rooms/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_room_not_found() throws Exception {
        UpdateRoomRequest request = new UpdateRoomRequest();
        request.setName("Room A");
        request.setLatitude(12.0);
        request.setLongitude(77.0);

        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/rooms/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_room_not_found() throws Exception {
        when(roomRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/rooms/1"))
                .andExpect(status().isNotFound());
    }
}
