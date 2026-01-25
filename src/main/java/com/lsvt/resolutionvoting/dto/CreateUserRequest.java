package com.lsvt.resolutionvoting.dto;

import com.lsvt.resolutionvoting.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(name = "CreateUserRequest", description = "Payload to create a user.")
public class CreateUserRequest {

    @NotBlank
    @Schema(example = "Siva Vishnu")
    private String name;

    @Email
    @NotBlank
    @Schema(example = "SivaVishnu@lsvt.com")
    private String email;

    @NotNull
    @Schema(example = "ADMIN", description = "User role: ADMIN or USER.")
    private UserRole role;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}




