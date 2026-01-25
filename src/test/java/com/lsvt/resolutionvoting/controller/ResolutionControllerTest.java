package com.lsvt.resolutionvoting.controller;

import com.lsvt.resolutionvoting.TestUtils;
import com.lsvt.resolutionvoting.dto.CreateResolutionRequest;
import com.lsvt.resolutionvoting.dto.ResolutionResultsResponse;
import com.lsvt.resolutionvoting.dto.UpdateResolutionRequest;
import com.lsvt.resolutionvoting.dto.VoteRequest;
import com.lsvt.resolutionvoting.model.Resolution;
import com.lsvt.resolutionvoting.model.ResolutionStatus;
import com.lsvt.resolutionvoting.model.Room;
import com.lsvt.resolutionvoting.model.VoteChoice;
import com.lsvt.resolutionvoting.repository.ResolutionRepository;
import com.lsvt.resolutionvoting.repository.RoomRepository;
import com.lsvt.resolutionvoting.service.ResolutionService;
import com.lsvt.resolutionvoting.service.VoteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResolutionController.class)
class ResolutionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResolutionRepository resolutionRepository;

    @MockBean
    private RoomRepository roomRepository;

    @MockBean
    private ResolutionService resolutionService;

    @MockBean
    private VoteService voteService;

    @Test
    void create_resolution_success() throws Exception {
        CreateResolutionRequest request = new CreateResolutionRequest();
        request.setTitle("Resolution");
        request.setDescription("Description");
        request.setRoomId(1L);

        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        Resolution saved = TestUtils.setId(new Resolution("Resolution", "Description", room), 10L);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(resolutionRepository.save(org.mockito.ArgumentMatchers.any(Resolution.class))).thenReturn(saved);

        mockMvc.perform(post("/api/resolutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.room.id").value(1));
    }

    @Test
    void create_resolution_room_not_found() throws Exception {
        CreateResolutionRequest request = new CreateResolutionRequest();
        request.setTitle("Resolution");
        request.setDescription("Description");
        request.setRoomId(1L);

        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/resolutions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void list_resolutions() throws Exception {
        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        Resolution resolution = TestUtils.setId(new Resolution("Resolution", "Description", room), 10L);
        when(resolutionRepository.findAll()).thenReturn(List.of(resolution));

        mockMvc.perform(get("/api/resolutions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void get_resolution_success() throws Exception {
        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        Resolution resolution = TestUtils.setId(new Resolution("Resolution", "Description", room), 10L);
        when(resolutionService.getResolution(10L)).thenReturn(resolution);

        mockMvc.perform(get("/api/resolutions/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void update_resolution_non_draft_rejected() throws Exception {
        UpdateResolutionRequest request = new UpdateResolutionRequest();
        request.setTitle("Resolution");
        request.setDescription("Description");
        request.setRoomId(1L);

        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.PUBLISHED);

        when(resolutionService.getResolution(10L)).thenReturn(resolution);

        mockMvc.perform(put("/api/resolutions/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_resolution_room_not_found() throws Exception {
        UpdateResolutionRequest request = new UpdateResolutionRequest();
        request.setTitle("Resolution");
        request.setDescription("Description");
        request.setRoomId(1L);

        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.DRAFT);

        when(resolutionService.getResolution(10L)).thenReturn(resolution);
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/resolutions/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_resolution_success() throws Exception {
        UpdateResolutionRequest request = new UpdateResolutionRequest();
        request.setTitle("Resolution");
        request.setDescription("Description");
        request.setRoomId(1L);

        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        Resolution resolution = TestUtils.setId(new Resolution("Old", "Old", room), 10L);
        resolution.setStatus(ResolutionStatus.DRAFT);

        when(resolutionService.getResolution(10L)).thenReturn(resolution);
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(resolutionRepository.save(resolution)).thenReturn(resolution);

        mockMvc.perform(put("/api/resolutions/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void delete_resolution_not_found() throws Exception {
        when(resolutionRepository.findById(10L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/resolutions/10"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_resolution_non_draft_rejected() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.PUBLISHED);

        when(resolutionRepository.findById(10L)).thenReturn(Optional.of(resolution));

        mockMvc.perform(delete("/api/resolutions/10"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void delete_resolution_success() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.DRAFT);

        when(resolutionRepository.findById(10L)).thenReturn(Optional.of(resolution));

        mockMvc.perform(delete("/api/resolutions/10"))
                .andExpect(status().isNoContent());
    }

    @Test
    void publish_resolution_success() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.PUBLISHED);

        when(resolutionService.publish(10L)).thenReturn(resolution);

        mockMvc.perform(post("/api/resolutions/10/publish"))
                .andExpect(status().isOk());
    }

    @Test
    void start_voting_success() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.VOTING);

        when(resolutionService.startVoting(10L)).thenReturn(resolution);

        mockMvc.perform(post("/api/resolutions/10/start-voting"))
                .andExpect(status().isOk());
    }

    @Test
    void end_direct_voting_success() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.PROXY_VOTING);

        when(resolutionService.endDirectVoting(10L)).thenReturn(resolution);

        mockMvc.perform(post("/api/resolutions/10/end-direct-voting"))
                .andExpect(status().isOk());
    }

    @Test
    void start_proxy_voting_success() throws Exception {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(ResolutionStatus.PROXY_VOTING);

        when(resolutionService.startProxyVoting(10L)).thenReturn(resolution);

        mockMvc.perform(post("/api/resolutions/10/start-proxy-voting"))
                .andExpect(status().isOk());
    }

    @Test
    void end_proxy_voting_returns_results() throws Exception {
        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        Resolution resolution = TestUtils.setId(new Resolution("Resolution", "Description", room), 10L);
        resolution.setStatus(ResolutionStatus.CLOSED);

        ResolutionResultsResponse results = new ResolutionResultsResponse(
                10L,
                "Resolution",
                "Description",
                com.lsvt.resolutionvoting.dto.RoomResponse.from(room),
                ResolutionStatus.CLOSED,
                1,
                1,
                0,
                0,
                new ResolutionResultsResponse.VoteBreakdown(1, 1, 0, 0),
                new ResolutionResultsResponse.VoteBreakdown(0, 0, 0, 0)
        );

        when(resolutionService.endProxyVoting(10L)).thenReturn(resolution);
        when(resolutionService.results(10L)).thenReturn(results);

        mockMvc.perform(post("/api/resolutions/10/end-proxy-voting"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resolutionId").value(10));
    }

    @Test
    void publish_results_success() throws Exception {
        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        ResolutionResultsResponse results = new ResolutionResultsResponse(
                10L,
                "Resolution",
                "Description",
                com.lsvt.resolutionvoting.dto.RoomResponse.from(room),
                ResolutionStatus.RESULTS_PUBLISHED,
                1,
                1,
                0,
                0,
                new ResolutionResultsResponse.VoteBreakdown(1, 1, 0, 0),
                new ResolutionResultsResponse.VoteBreakdown(0, 0, 0, 0)
        );

        when(resolutionService.publishResults(10L)).thenReturn(
                TestUtils.setId(new Resolution("Resolution", "Description", room), 10L)
        );
        when(resolutionService.results(10L)).thenReturn(results);

        mockMvc.perform(post("/api/resolutions/10/publish-results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESULTS_PUBLISHED"));
    }

    @Test
    void cast_vote_validation_error() throws Exception {
        VoteRequest request = new VoteRequest();
        request.setVoterId(1L);
        request.setChoice(VoteChoice.FOR);
        request.setLatitude(12.0);

        mockMvc.perform(post("/api/resolutions/10/votes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void cast_vote_success() throws Exception {
        VoteRequest request = new VoteRequest();
        request.setVoterId(1L);
        request.setChoice(VoteChoice.FOR);
        request.setLatitude(12.0);
        request.setLongitude(77.0);

        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        when(voteService.castVote(eq(10L), any(VoteRequest.class)))
                .thenReturn(new com.lsvt.resolutionvoting.model.Vote(
                        resolution,
                        new com.lsvt.resolutionvoting.model.User("User", "user@example.com",
                                com.lsvt.resolutionvoting.model.UserRole.USER),
                        null,
                        new com.lsvt.resolutionvoting.model.User("User", "user@example.com",
                                com.lsvt.resolutionvoting.model.UserRole.USER),
                        com.lsvt.resolutionvoting.model.VoteChoice.FOR
                ));

        mockMvc.perform(post("/api/resolutions/10/votes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void get_results_success() throws Exception {
        Room room = TestUtils.setId(new Room("Room A", 12.0, 77.0), 1L);
        ResolutionResultsResponse results = new ResolutionResultsResponse(
                10L,
                "Resolution",
                "Description",
                com.lsvt.resolutionvoting.dto.RoomResponse.from(room),
                ResolutionStatus.RESULTS_PUBLISHED,
                1,
                1,
                0,
                0,
                new ResolutionResultsResponse.VoteBreakdown(1, 1, 0, 0),
                new ResolutionResultsResponse.VoteBreakdown(0, 0, 0, 0)
        );

        when(resolutionService.results(10L)).thenReturn(results);

        mockMvc.perform(get("/api/resolutions/10/results"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resolutionId").value(10));
    }
}

