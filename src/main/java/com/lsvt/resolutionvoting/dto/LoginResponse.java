package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(name = "LoginResponse", description = "Login response with token and user info")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private LoginAuthResponse authLoginResponse;
    private UserRoleResponse userRoleResponse;
}
