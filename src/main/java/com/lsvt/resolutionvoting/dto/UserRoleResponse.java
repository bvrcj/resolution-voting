package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;


@Schema(name = "RolesResponse", description = "Login response with token and user info")
@Data
public class UserRoleResponse {
    @Schema(example = "VENKATA RAGHUNADHA CHAITANYA RAGHUNADHA CHAITANYA BOMMARAJU")
    private String fullName;
    @Schema(example = "VENKATA RAGHUNADHA CHAITANYA RAGHUNADHA CHAITANYA BOMMARAJU")
    private String firstAndLastName;
    @Schema(example = "[\n" +
            "        {\n" +
            "        \"roleId\": 28,\n" +
            "        \"roleName\": \"Devotee\"\n" +
            "        }\n" +
            "        ]")
    private List<Roles> roles;
    @Schema(example = "null")
    private String defaultRole;
}

