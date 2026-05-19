package com.lsvt.resolutionvoting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;


@Schema(name = "UserRoles", description = "User roles response info")
@Data
public class Roles {
    @Schema(example = "28")
    private String roleId;
    @Schema(example = "Devotee")
    private String roleName;
}
