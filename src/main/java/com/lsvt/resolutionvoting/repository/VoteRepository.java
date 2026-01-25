package com.lsvt.resolutionvoting.repository;

import com.lsvt.resolutionvoting.model.Vote;
import com.lsvt.resolutionvoting.model.VoteChoice;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByResolutionIdAndEffectiveVoterId(Long resolutionId, Long effectiveVoterId);

    Optional<Vote> findByResolutionIdAndEffectiveVoterId(Long resolutionId, Long effectiveVoterId);

    long countByResolutionIdAndChoice(Long resolutionId, VoteChoice choice);

    long countByResolutionId(Long resolutionId);

    long countByResolutionIdAndProxyForIsNull(Long resolutionId);

    long countByResolutionIdAndProxyForIsNotNull(Long resolutionId);

    long countByResolutionIdAndProxyForIsNullAndChoice(Long resolutionId, VoteChoice choice);

    long countByResolutionIdAndProxyForIsNotNullAndChoice(Long resolutionId, VoteChoice choice);

    List<Vote> findByResolutionId(Long resolutionId);
}

