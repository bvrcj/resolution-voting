package com.lsvt.resolutionvoting.service;

import com.lsvt.resolutionvoting.dto.VoteRequest;
import com.lsvt.resolutionvoting.model.Resolution;
import com.lsvt.resolutionvoting.model.ResolutionStatus;
import com.lsvt.resolutionvoting.model.Room;
import com.lsvt.resolutionvoting.model.User;
import com.lsvt.resolutionvoting.model.UserRole;
import com.lsvt.resolutionvoting.model.Vote;
import com.lsvt.resolutionvoting.model.VoteChoice;
import com.lsvt.resolutionvoting.repository.ResolutionRepository;
import com.lsvt.resolutionvoting.repository.UserRepository;
import com.lsvt.resolutionvoting.repository.VoteRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock
    private ResolutionRepository resolutionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VoteRepository voteRepository;

    @InjectMocks
    private VoteService voteService;

    @Test
    void cast_vote_resolution_not_found() {
        when(resolutionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> voteService.castVote(1L, buildRequest(null)))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_not_active() {
        Resolution resolution = buildResolution(ResolutionStatus.PUBLISHED);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));

        assertThatThrownBy(() -> voteService.castVote(1L, buildRequest(null)))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_voter_not_found() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> voteService.castVote(1L, buildRequest(null)))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_proxy_user_not_found() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(buildUser(2L)));
        when(userRepository.findById(3L)).thenReturn(Optional.empty());

        VoteRequest request = buildRequest(3L);
        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_proxy_vote_during_direct_phase_rejected() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(buildUser(2L)));
        when(userRepository.findById(3L)).thenReturn(Optional.of(buildUser(3L)));

        VoteRequest request = buildRequest(3L);
        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_direct_vote_during_proxy_phase_rejected() {
        Resolution resolution = buildResolution(ResolutionStatus.PROXY_VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(buildUser(2L)));

        VoteRequest request = buildRequest(null);
        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_location_mismatch_rejected() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(buildUser(2L)));

        VoteRequest request = buildRequest(null);
        request.setLatitude(0.0);
        request.setLongitude(0.0);

        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_location_mismatch_longitude_only_rejected() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(buildUser(2L)));

        VoteRequest request = buildRequest(null);
        request.setLongitude(0.0);

        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_proxy_vote_when_direct_already_exists_rejected() {
        Resolution resolution = buildResolution(ResolutionStatus.PROXY_VOTING);
        User voter = buildUser(2L);
        User proxyFor = buildUser(3L);
        Vote existing = new Vote(resolution, voter, null, proxyFor, VoteChoice.FOR);

        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(voter));
        when(userRepository.findById(3L)).thenReturn(Optional.of(proxyFor));
        when(voteRepository.findByResolutionIdAndEffectiveVoterId(1L, 3L)).thenReturn(Optional.of(existing));

        VoteRequest request = buildRequest(3L);
        assertThatThrownBy(() -> voteService.castVote(1L, request))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cast_vote_creates_new() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        User voter = buildUser(2L);

        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(voter));
        when(voteRepository.findByResolutionIdAndEffectiveVoterId(1L, 2L)).thenReturn(Optional.empty());
        when(voteRepository.save(org.mockito.ArgumentMatchers.any(Vote.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        VoteRequest request = buildRequest(null);
        Vote vote = voteService.castVote(1L, request);

        assertThat(vote.getChoice()).isEqualTo(VoteChoice.FOR);
    }

    @Test
    void cast_vote_updates_existing() {
        Resolution resolution = buildResolution(ResolutionStatus.VOTING);
        User voter = buildUser(2L);
        Vote existing = new Vote(resolution, voter, null, voter, VoteChoice.AGAINST);

        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(voter));
        when(voteRepository.findByResolutionIdAndEffectiveVoterId(1L, 2L)).thenReturn(Optional.of(existing));
        when(voteRepository.save(existing)).thenReturn(existing);

        VoteRequest request = buildRequest(null);
        Vote vote = voteService.castVote(1L, request);

        assertThat(vote.getChoice()).isEqualTo(VoteChoice.FOR);
        verify(voteRepository, never()).save(org.mockito.ArgumentMatchers.argThat(v -> v != existing));
    }

    @Test
    void cast_proxy_vote_updates_existing_proxy_vote() {
        Resolution resolution = buildResolution(ResolutionStatus.PROXY_VOTING);
        User voter = buildUser(2L);
        User proxyFor = buildUser(3L);
        Vote existing = new Vote(resolution, voter, proxyFor, proxyFor, VoteChoice.AGAINST);

        when(resolutionRepository.findById(1L)).thenReturn(Optional.of(resolution));
        when(userRepository.findById(2L)).thenReturn(Optional.of(voter));
        when(userRepository.findById(3L)).thenReturn(Optional.of(proxyFor));
        when(voteRepository.findByResolutionIdAndEffectiveVoterId(1L, 3L)).thenReturn(Optional.of(existing));
        when(voteRepository.save(existing)).thenReturn(existing);

        VoteRequest request = buildRequest(3L);
        Vote vote = voteService.castVote(1L, request);

        assertThat(vote.getChoice()).isEqualTo(VoteChoice.FOR);
    }

    private VoteRequest buildRequest(Long proxyForUserId) {
        VoteRequest request = new VoteRequest();
        request.setVoterId(2L);
        request.setProxyForUserId(proxyForUserId);
        request.setChoice(VoteChoice.FOR);
        request.setLatitude(12.0);
        request.setLongitude(77.0);
        return request;
    }

    private Resolution buildResolution(ResolutionStatus status) {
        Room room = new Room("Room A", 12.0, 77.0);
        Resolution resolution = new Resolution("Resolution", "Description", room);
        resolution.setStatus(status);
        return resolution;
    }

    private User buildUser(Long id) {
        User user = new User("User", "user" + id + "@example.com", UserRole.USER);
        return com.lsvt.resolutionvoting.TestUtils.setId(user, id);
    }
}

