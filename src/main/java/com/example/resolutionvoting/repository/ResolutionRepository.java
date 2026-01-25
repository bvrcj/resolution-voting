package com.example.resolutionvoting.repository;

import com.example.resolutionvoting.model.Resolution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResolutionRepository extends JpaRepository<Resolution, Long> {
}
