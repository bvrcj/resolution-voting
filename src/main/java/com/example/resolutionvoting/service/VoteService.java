package com.example.resolutionvoting.service;

import com.example.resolutionvoting.dto.VoteRequest;
import com.example.resolutionvoting.model.Resolution;
import com.example.resolutionvoting.model.ResolutionStatus;
import com.example.resolutionvoting.model.User;
import com.example.resolutionvoting.model.Vote;
import com.example.resolutionvoting.repository.ResolutionRepository;
import com.example.resolutionvoting.repository.UserRepository;
import com.example.resolutionvoting.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class VoteService {

    private final ResolutionRepository resolutionRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    public VoteService(
            ResolutionRepository resolutionRepository,
            UserRepository userRepository,
            VoteRepository voteRepository
    ) {
        this.resolutionRepository = resolutionRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional
    public Vote castVote(Long resolutionId, VoteRequest request) {
        Resolution resolution = resolutionRepository.findById(resolutionId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Resolution not found"));
        if (resolution.getStatus() != ResolutionStatus.VOTING
                && resolution.getStatus() != ResolutionStatus.PROXY_VOTING) {
            throw new ResponseStatusException(BAD_REQUEST, "Voting is not active for this resolution");
        }

        User voter = userRepository.findById(request.getVoterId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Voter not found"));

        User proxyFor = null;
        if (request.getProxyForUserId() != null) {
            proxyFor = userRepository.findById(request.getProxyForUserId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Proxy user not found"));
        }
        final User finalProxyFor = proxyFor;

        if (resolution.getStatus() == ResolutionStatus.VOTING && finalProxyFor != null) {
            throw new ResponseStatusException(BAD_REQUEST, "Proxy voting is not active for this resolution");
        }

        if (resolution.getStatus() == ResolutionStatus.PROXY_VOTING && finalProxyFor == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Direct voting has ended for this resolution");
        }

        if (Double.compare(request.getLatitude(), resolution.getRoom().getLatitude()) != 0
                || Double.compare(request.getLongitude(), resolution.getRoom().getLongitude()) != 0) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Voting location does not match the resolution room"
            );
        }

        User effectiveVoter = finalProxyFor != null ? finalProxyFor : voter;

        return voteRepository.findByResolutionIdAndEffectiveVoterId(resolutionId, effectiveVoter.getId())
                .map(existing -> {
                    if (finalProxyFor != null && existing.getProxyFor() == null) {
                        throw new ResponseStatusException(
                                BAD_REQUEST,
                                "User already voted directly; proxy vote is not allowed"
                        );
                    }
                    existing.setChoice(request.getChoice());
                    return voteRepository.save(existing);
                })
                .orElseGet(() -> voteRepository.save(
                        new Vote(resolution, voter, finalProxyFor, effectiveVoter, request.getChoice())
                ));
    }
}
