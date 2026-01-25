package com.lsvt.resolutionvoting.repository;

import com.lsvt.resolutionvoting.model.Resolution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResolutionRepository extends JpaRepository<Resolution, Long> {
}

