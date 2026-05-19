package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(name = "LoginRequest", description = "Login credentials")
public class LoginRequest {

    @NotBlank
    @Schema(example = "username")
    private String username;

    @NotBlank
    @Schema(example = "password123")
    private String password;

}
