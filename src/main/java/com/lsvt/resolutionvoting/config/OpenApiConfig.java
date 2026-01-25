package com.lsvt.resolutionvoting.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Resolution Voting API",
                version = "v1",
                description = "API for managing rooms, resolutions, users, and votes. "
                        + "Resolutions move through DRAFT -> PUBLISHED -> VOTING -> PROXY_VOTING -> CLOSED "
                        + "-> RESULTS_PUBLISHED. "
                        + "Only DRAFT resolutions can be updated or deleted. "
                        + "Direct votes are allowed in VOTING, proxy votes in PROXY_VOTING. "
                        + "Voting latitude/longitude must match the resolution room."
        )
)
public class OpenApiConfig {
}

