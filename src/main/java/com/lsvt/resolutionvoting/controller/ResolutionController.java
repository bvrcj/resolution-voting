package com.lsvt.resolutionvoting.controller;

import com.lsvt.resolutionvoting.dto.CreateResolutionRequest;
import com.lsvt.resolutionvoting.dto.LiveResolutionResponse;
import com.lsvt.resolutionvoting.dto.ResolutionResponse;
import com.lsvt.resolutionvoting.dto.ResolutionResultsResponse;
import com.lsvt.resolutionvoting.dto.UpdateResolutionRequest;
import com.lsvt.resolutionvoting.dto.VoteRequest;
import com.lsvt.resolutionvoting.model.Resolution;
import com.lsvt.resolutionvoting.model.ResolutionStatus;
import com.lsvt.resolutionvoting.model.Room;
import com.lsvt.resolutionvoting.repository.ResolutionRepository;
import com.lsvt.resolutionvoting.repository.RoomRepository;
import com.lsvt.resolutionvoting.service.ResolutionService;
import com.lsvt.resolutionvoting.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.time.Instant;
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
import org.springframework.validation.annotation.Validated;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/resolutions")
@Tag(name = "Resolutions", description = "Create, publish, and vote on resolutions.")
@Validated
public class ResolutionController {

    private final ResolutionRepository resolutionRepository;
    private final RoomRepository roomRepository;
    private final ResolutionService resolutionService;
    private final VoteService voteService;

    public ResolutionController(
            ResolutionRepository resolutionRepository,
            RoomRepository roomRepository,
            ResolutionService resolutionService,
            VoteService voteService
    ) {
        this.resolutionRepository = resolutionRepository;
        this.roomRepository = roomRepository;
        this.resolutionService = resolutionService;
        this.voteService = voteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create resolution", description = "Creates a new resolution in DRAFT status.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Resolution created",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResolutionResponse createResolution(@Valid @RequestBody CreateResolutionRequest request) {
        validateSchedule(request.getPublishAt(), request.getVotingStartAt(), request.getVotingEndAt());
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));
        Resolution resolution = new Resolution(request.getTitle(), request.getDescription(), room);
        resolution.setPublishAt(request.getPublishAt());
        resolution.setVotingStartAt(request.getVotingStartAt());
        resolution.setVotingEndAt(request.getVotingEndAt());
        return ResolutionResponse.from(resolutionRepository.save(resolution));
    }

    @GetMapping
    @Operation(summary = "List resolutions", description = "Returns all resolutions.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "List of resolutions",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = ResolutionResponse.class))))
    })
    public List<ResolutionResponse> listResolutions() {
        return resolutionRepository.findAll().stream().map(ResolutionResponse::from).toList();
    }

    @GetMapping("/{id:[0-9]+}")
    @Operation(summary = "Get resolution", description = "Returns a resolution by id.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resolution found",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse getResolution(@PathVariable @Positive Long id) {
        return ResolutionResponse.from(resolutionService.getResolution(id));
    }

    @PutMapping("/{id:[0-9]+}")
    @Operation(summary = "Update resolution", description = "Updates a DRAFT resolution.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resolution updated",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Resolution can be updated only before voting starts"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse updateResolution(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateResolutionRequest request
    ) {
        validateSchedule(request.getPublishAt(), request.getVotingStartAt(), request.getVotingEndAt());
        Resolution resolution = resolutionService.getResolution(id);
        if (resolution.getStatus() == ResolutionStatus.VOTING
                || resolution.getStatus() == ResolutionStatus.PROXY_VOTING
                || resolution.getStatus() == ResolutionStatus.CLOSED
                || resolution.getStatus() == ResolutionStatus.RESULTS_PUBLISHED
                || resolution.getVotingStartedAt() != null) {
            throw new ResponseStatusException(BAD_REQUEST, "Resolution can be updated only before voting starts");
        }
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Room not found"));
        resolution.setTitle(request.getTitle());
        resolution.setDescription(request.getDescription());
        resolution.setRoom(room);
        resolution.setPublishAt(request.getPublishAt());
        resolution.setVotingStartAt(request.getVotingStartAt());
        resolution.setVotingEndAt(request.getVotingEndAt());
        return ResolutionResponse.from(resolutionRepository.save(resolution));
    }

    @DeleteMapping("/{id:[0-9]+}")
    @Operation(summary = "Delete resolution", description = "Deletes a DRAFT resolution.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resolution deleted",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Only DRAFT resolutions can be deleted"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse deleteResolution(@PathVariable @Positive Long id) {
        Resolution resolution = resolutionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Resolution not found"));
        if (resolution.getStatus() != ResolutionStatus.DRAFT) {
            throw new ResponseStatusException(BAD_REQUEST, "Only draft resolutions can be deleted");
        }
        ResolutionResponse response = ResolutionResponse.from(resolution);
        resolutionRepository.delete(resolution);
        return response;
    }

    @PostMapping("/{id:[0-9]+}/publish")
    @Operation(summary = "Publish resolution", description = "Moves a resolution to PUBLISHED status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resolution published",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse publish(@PathVariable @Positive Long id) {
        return ResolutionResponse.from(resolutionService.publish(id));
    }

    @PostMapping("/{id:[0-9]+}/start-voting")
    @Operation(summary = "Start direct voting", description = "Moves a resolution to VOTING status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Voting started",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse startVoting(@PathVariable @Positive Long id) {
        return ResolutionResponse.from(resolutionService.startVoting(id));
    }

    @PostMapping("/{id:[0-9]+}/end-direct-voting")
    @Operation(summary = "End direct voting", description = "Moves a resolution to PROXY_VOTING status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Direct voting ended",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Direct voting is not active"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse endDirectVoting(@PathVariable @Positive Long id) {
        return ResolutionResponse.from(resolutionService.endDirectVoting(id));
    }

    @PostMapping("/{id:[0-9]+}/start-proxy-voting")
    @Operation(summary = "Start proxy voting", description = "Moves a resolution to PROXY_VOTING status.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Proxy voting started",
                    content = @Content(schema = @Schema(implementation = ResolutionResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResponse startProxyVoting(@PathVariable @Positive Long id) {
        return ResolutionResponse.from(resolutionService.startProxyVoting(id));
    }

    @PostMapping("/{id:[0-9]+}/end-proxy-voting")
    @Operation(summary = "End proxy voting", description = "Closes voting and returns aggregated results.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Voting ended",
                    content = @Content(schema = @Schema(implementation = ResolutionResultsResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status transition"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResultsResponse endProxyVoting(@PathVariable @Positive Long id) {
        resolutionService.endProxyVoting(id);
        return resolutionService.results(id);
    }

    @PostMapping("/{id:[0-9]+}/publish-results")
    @Operation(summary = "Publish results", description = "Marks results as published after voting ends.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Results published",
                    content = @Content(schema = @Schema(implementation = ResolutionResultsResponse.class))),
            @ApiResponse(responseCode = "400", description = "Voting must be closed to publish results"),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResultsResponse publishResults(@PathVariable @Positive Long id) {
        resolutionService.publishResults(id);
        return resolutionService.results(id);
    }

    @PostMapping("/{id:[0-9]+}/votes")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Cast vote",
            description = "Casts a vote for a resolution. Direct votes are allowed in VOTING, proxy votes in "
                    + "PROXY_VOTING. Existing votes for the same effective voter update the choice. "
                    + "Latitude/longitude must match the resolution room."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Vote recorded"),
            @ApiResponse(responseCode = "400", description = "Invalid vote"),
            @ApiResponse(responseCode = "404", description = "Resolution or voter not found")
    })
    public void castVote(@PathVariable @Positive Long id, @Valid @RequestBody VoteRequest request) {
        voteService.castVote(id, request);
    }

    @GetMapping("/{id:[0-9]+}/results")
    @Operation(summary = "Get results", description = "Returns aggregated results for a resolution.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Results returned",
                    content = @Content(schema = @Schema(implementation = ResolutionResultsResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResultsResponse results(@PathVariable @Positive Long id) {
        return resolutionService.results(id);
    }

    @GetMapping("/{id:[0-9]+}/live-results")
    @Operation(summary = "Get live results", description = "Returns live vote totals during voting.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Live results returned",
                    content = @Content(schema = @Schema(implementation = ResolutionResultsResponse.class))),
            @ApiResponse(responseCode = "404", description = "Resolution not found")
    })
    public ResolutionResultsResponse liveResults(@PathVariable @Positive Long id) {
        return resolutionService.liveResults(id);
    }

    @GetMapping("/live-dashboard")
    @Operation(summary = "Live dashboard", description = "Returns resolutions with live vote counts for active sessions.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Live dashboard returned",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = LiveResolutionResponse.class))))
    })
    public List<LiveResolutionResponse> liveDashboard() {
        return resolutionService.liveDashboard();
    }

    private void validateSchedule(Instant publishAt, Instant votingStartAt, Instant votingEndAt) {
        if (votingStartAt != null && votingEndAt != null && votingEndAt.isBefore(votingStartAt)) {
            throw new ResponseStatusException(BAD_REQUEST, "Voting end must be after voting start");
        }
        if (publishAt != null && votingStartAt != null && votingStartAt.isBefore(publishAt)) {
            throw new ResponseStatusException(BAD_REQUEST, "Voting start must be after publish date");
        }
    }
}

