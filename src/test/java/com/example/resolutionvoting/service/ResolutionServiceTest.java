package com.example.resolutionvoting.service;

import com.example.resolutionvoting.TestUtils;
import com.example.resolutionvoting.dto.ResolutionResultsResponse;
import com.example.resolutionvoting.model.Resolution;
import com.example.resolutionvoting.model.ResolutionStatus;
import com.example.resolutionvoting.model.Room;
import com.example.resolutionvoting.model.VoteChoice;
import com.example.resolutionvoting.repository.ResolutionRepository;
import com.example.resolutionvoting.repository.VoteRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResolutionServiceTest {

    @Mock
    private ResolutionRepository resolutionRepository;

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private ResolutionService resolutionService;

    @Test
    void publish_draft_resolution() {
        Resolution resolution = buildResolution(ResolutionStatus.DRAFT);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        Resolution result = resolutionService.publish(1L);

        assertThat(result.getStatus()).isEqualTo(ResolutionStatus.PUBLISHED);
    }

    @Test
    void publish_non_draft_throws() {
        Resolution resolution = buildResolution(ResolutionStatus.PUBLISHED);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.publish(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void start_voting_published_resolution() {
        Resolution resolution = buildResolution(ResolutionStatus.PUBLISHED);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        Resolution result = resolutionService.startVoting(1L);

        assertThat(result.getStatus()).isEqualTo(ResolutionStatus.VOTING);
        assertThat(result.getVotingStartedAt()).isNotNull();
    }

    @Test
    void start_voting_wrong_status_throws() {
        Resolution resolution = buildResolution(ResolutionStatus.DRAFT);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.startVoting(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void end_direct_voting_requires_voting() {
        Resolution resolution = buildResolution(ResolutionStatus.PUBLISHED);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.endDirectVoting(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void start_proxy_voting_requires_voting() {
        Resolution resolution = buildResolution(ResolutionStatus.PUBLISHED);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.startProxyVoting(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void end_proxy_voting_requires_proxy_voting() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.endProxyVoting(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void publish_results_requires_closed() {
        Resolution resolution = buildResolution(ResolutionStatus.PROXY_VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.publishResults(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void results_require_closed_or_published() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> resolutionService.results(1L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void results_return_breakdown() {
        Resolution resolution = buildResolution(ResolutionStatus.CLOSED);
        TestUtils.setId(resolution, 10L);
        when(resolutionRepository.findById(10L)).thenReturn(Optional.of(resolution));
        when(voteRepository.countByResolutionId(10L)).thenReturn(5L);
        when(voteRepository.countByResolutionIdAndChoice(10L, VoteChoice.FOR)).thenReturn(3L);
        when(voteRepository.countByResolutionIdAndChoice(10L, VoteChoice.AGAINST)).thenReturn(1L);
        when(voteRepository.countByResolutionIdAndChoice(10L, VoteChoice.ABSTAIN)).thenReturn(1L);
        when(voteRepository.countByResolutionIdAndProxyForIsNull(10L)).thenReturn(3L);
        when(voteRepository.countByResolutionIdAndProxyForIsNotNull(10L)).thenReturn(2L);
        when(voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(10L, VoteChoice.FOR)).thenReturn(2L);
        when(voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(10L, VoteChoice.AGAINST)).thenReturn(1L);
        when(voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(10L, VoteChoice.ABSTAIN)).thenReturn(0L);
        when(voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(10L, VoteChoice.FOR)).thenReturn(1L);
        when(voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(10L, VoteChoice.AGAINST)).thenReturn(0L);
        when(voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(10L, VoteChoice.ABSTAIN)).thenReturn(1L);

        ResolutionResultsResponse response = resolutionService.results(10L);

        assertThat(response.getResolutionId()).isEqualTo(10L);
        assertThat(response.getResolutionTitle()).isEqualTo("Resolution");
        assertThat(response.getResolutionDescription()).isEqualTo("Description");
        assertThat(response.getRoom().getName()).isEqualTo("Room A");
        assertThat(response.getTotalVotes()).isEqualTo(5L);
        assertThat(response.getDirectVotes().getTotal()).isEqualTo(3L);
        assertThat(response.getProxyVotes().getTotal()).isEqualTo(2L);
    }

    private Resolution buildResolution(ResolutionStatus status) {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(status);
        return resolution;
    }
}
