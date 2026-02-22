package com.lsvt.resolutionvoting.service;

import com.lsvt.resolutionvoting.dto.ResolutionResultsResponse;
import com.lsvt.resolutionvoting.dto.RoomResponse;
import com.lsvt.resolutionvoting.dto.LiveResolutionResponse;
import com.lsvt.resolutionvoting.model.Resolution;
import com.lsvt.resolutionvoting.model.ResolutionStatus;
import com.lsvt.resolutionvoting.model.VoteChoice;
import com.lsvt.resolutionvoting.repository.ResolutionRepository;
import com.lsvt.resolutionvoting.repository.VoteRepository;
import java.time.Instant;
import java.util.EnumSet;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class ResolutionService {

    private final ResolutionRepository resolutionRepository;
    private final VoteRepository voteRepository;

    public ResolutionService(ResolutionRepository resolutionRepository, VoteRepository voteRepository) {
        this.resolutionRepository = resolutionRepository;
        this.voteRepository = voteRepository;
    }

    public Resolution getResolution(Long id) {
        return resolutionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Resolution not found"));
    }

    @Transactional
    public Resolution publish(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.DRAFT) {
            throw new ResponseStatusException(BAD_REQUEST, "Only draft resolutions can be published");
        }
        resolution.setStatus(ResolutionStatus.PUBLISHED);
        return resolution;
    }

    @Transactional
    public Resolution startVoting(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.PUBLISHED) {
            throw new ResponseStatusException(BAD_REQUEST, "Only published resolutions can start voting");
        }
        resolution.setStatus(ResolutionStatus.VOTING);
        resolution.setVotingStartedAt(Instant.now());
        return resolution;
    }

    @Transactional
    public Resolution endDirectVoting(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.VOTING) {
            throw new ResponseStatusException(BAD_REQUEST, "Direct voting is not active");
        }
        resolution.setStatus(ResolutionStatus.PROXY_VOTING);
        return resolution;
    }

    @Transactional
    public Resolution startProxyVoting(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.VOTING) {
            throw new ResponseStatusException(BAD_REQUEST, "Direct voting must be active to start proxy voting");
        }
        resolution.setStatus(ResolutionStatus.PROXY_VOTING);
        return resolution;
    }

    @Transactional
    public Resolution endProxyVoting(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.PROXY_VOTING) {
            throw new ResponseStatusException(BAD_REQUEST, "Proxy voting must be active to end voting");
        }
        resolution.setStatus(ResolutionStatus.CLOSED);
        resolution.setVotingEndedAt(Instant.now());
        return resolution;
    }

    @Transactional
    public Resolution publishResults(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.CLOSED) {
            throw new ResponseStatusException(BAD_REQUEST, "Voting must be closed to publish results");
        }
        resolution.setStatus(ResolutionStatus.RESULTS_PUBLISHED);
        return resolution;
    }

    @Transactional(readOnly = true)
    public ResolutionResultsResponse results(Long id) {
        Resolution resolution = getResolution(id);
        if (resolution.getStatus() != ResolutionStatus.CLOSED
                && resolution.getStatus() != ResolutionStatus.RESULTS_PUBLISHED) {
            throw new ResponseStatusException(BAD_REQUEST, "Results are available after voting is closed");
        }
        return buildResultsResponse(resolution);
    }

    @Transactional(readOnly = true)
    public ResolutionResultsResponse liveResults(Long id) {
        Resolution resolution = getResolution(id);
        return buildResultsResponse(resolution);
    }

    @Transactional(readOnly = true)
    public List<LiveResolutionResponse> liveDashboard() {
        EnumSet<ResolutionStatus> liveStatuses = EnumSet.of(
                ResolutionStatus.VOTING,
                ResolutionStatus.PROXY_VOTING
        );
        return resolutionRepository.findAll().stream()
                .map(resolution -> {
                    ResolutionResultsResponse results = liveStatuses.contains(resolution.getStatus())
                            ? buildResultsResponse(resolution)
                            : null;
                    return new LiveResolutionResponse(
                            com.lsvt.resolutionvoting.dto.ResolutionResponse.from(resolution),
                            results
                    );
                })
                .toList();
    }

    private ResolutionResultsResponse buildResultsResponse(Resolution resolution) {
        Long id = resolution.getId();
        long total = voteRepository.countByResolutionId(id);
        long forCount = voteRepository.countByResolutionIdAndChoice(id, VoteChoice.FOR);
        long againstCount = voteRepository.countByResolutionIdAndChoice(id, VoteChoice.AGAINST);
        long abstainCount = voteRepository.countByResolutionIdAndChoice(id, VoteChoice.ABSTAIN);
        long directVotes = voteRepository.countByResolutionIdAndProxyForIsNull(id);
        long proxyVotes = voteRepository.countByResolutionIdAndProxyForIsNotNull(id);
        long directForCount = voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(id, VoteChoice.FOR);
        long directAgainstCount = voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(id, VoteChoice.AGAINST);
        long directAbstainCount = voteRepository.countByResolutionIdAndProxyForIsNullAndChoice(id, VoteChoice.ABSTAIN);
        long proxyForCount = voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(id, VoteChoice.FOR);
        long proxyAgainstCount = voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(id, VoteChoice.AGAINST);
        long proxyAbstainCount = voteRepository.countByResolutionIdAndProxyForIsNotNullAndChoice(id, VoteChoice.ABSTAIN);
        return new ResolutionResultsResponse(
                resolution.getId(),
                resolution.getTitle(),
                resolution.getDescription(),
                RoomResponse.from(resolution.getRoom()),
                resolution.getStatus(),
                total,
                forCount,
                againstCount,
                abstainCount,
                new ResolutionResultsResponse.VoteBreakdown(
                        directVotes,
                        directForCount,
                        directAgainstCount,
                        directAbstainCount
                ),
                new ResolutionResultsResponse.VoteBreakdown(
                        proxyVotes,
                        proxyForCount,
                        proxyAgainstCount,
                        proxyAbstainCount
                )
        );
    }
}

