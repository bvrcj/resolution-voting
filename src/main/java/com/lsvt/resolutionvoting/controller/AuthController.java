package com.lsvt.resolutionvoting.controller;

import com.lsvt.resolutionvoting.service.TempleAuthService;
import com.lsvt.resolutionvoting.dto.LoginRequest;
import com.lsvt.resolutionvoting.dto.LoginResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
//@CrossOrigin(origins = "*")
public class AuthController {
    private final TempleAuthService templeAuthService;

    public AuthController(TempleAuthService templeAuthService) {
        this.templeAuthService = templeAuthService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

       return templeAuthService.loginLSVT(request.getUsername(), request.getPassword());
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Invalidate JWT token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public void logout(@RequestHeader(value = "Authorization", required = true) String token) {

        templeAuthService.logout(token);
    }

}
