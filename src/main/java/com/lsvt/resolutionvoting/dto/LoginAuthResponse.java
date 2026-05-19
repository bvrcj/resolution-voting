package com.lsvt.resolutionvoting.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Schema(name = "LoginResponse", description = "Login response with token and user info")
@Data
public class LoginAuthResponse {
    @Schema(example = "{}")
    private String properties;
    @Schema(example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    @Schema(example = "null")
    private String defaultRole;
    @Schema(example = "[\"Devotee\"]")
    private List<String> roles;
    @Schema(example = "[\"CHANGE_PASSWORD\",\"DEVOTEE_SERVICE\",\"DONATION\",\"DONATION_HISTORY\",\"EVENT_HALL_BOOKING_REQUEST\",\"FAMILY_MEMBERS\",\"FAVORITE_EVENTS\",\"LADDU_OR_KARASEV_OR_VADA\",\"MODIFY_PROFILE\",\"MY_PROFILE\",\"POOJA_BOOKING_REQUEST\",\"REPORTS\",\"STOCK_DONATION\",\"SUBSCRIPTIONS\",\"VASTRA\",\"YEAR_END_REPORT\"]")
    private String[] permissions;
    @Schema(example = "false")
    private boolean disableCaptcha;
}
