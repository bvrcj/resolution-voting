package com.example.resolutionvoting.dto;

import com.example.resolutionvoting.model.User;
import com.example.resolutionvoting.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "UserResponse", description = "User details.")
public class UserResponse {

    @Schema(example = "1")
    private Long id;
    @Schema(example = "Ada Lovelace")
    private String name;
    @Schema(example = "ada@example.com")
    private String email;
    @Schema(example = "ADMIN", description = "User role: ADMIN or USER.")
    private UserRole role;

    public UserResponse(Long id, String name, String email, UserRole role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }
}
