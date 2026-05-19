package com.lsvt.resolutionvoting.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lsvt.resolutionvoting.dto.LoginAuthResponse;
import com.lsvt.resolutionvoting.dto.UserRoleResponse;
import com.lsvt.resolutionvoting.dto.LoginResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;


@Service
public class TempleAuthService {
    private final RestClient restClient;

    public TempleAuthService(@Qualifier("templeRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public AuthLoginResponse login(String username, String password) {

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("password", password);

        String rawResponse = restClient.post()
                .uri("/auth/login")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(String.class);   // <-- FIX: read as raw string

        try {
            return new ObjectMapper().readValue(rawResponse, AuthLoginResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse login response: " + rawResponse, e);
        }
    }

    public AuthRoleResponse getUserRoles(String username, String token) {

        String rawResponse = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/devotee-management/userCategories/userRolesInfo")
                        .queryParam("username", username)
                        .build())
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(String.class);   // <-- FIX

        try {
            return new ObjectMapper().readValue(rawResponse, AuthRoleResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse role response: " + rawResponse, e);
        }
    }

    public LoginResponse loginLSVT(String username, String password) {

        // 1. Perform login
        LoginAuthResponse authLoginResponse = login(username, password);

        if (authLoginResponse == null || authLoginResponse.getAccessToken() == null) {
            return null; // or throw exception
        }

        // 2. Get user roles
        UserRoleResponse userRoleResponse = getUserRoles(username, authLoginResponse.getAccessToken());

        // 3. Combine and return
        return new LoginResponse(authLoginResponse, userRoleResponse);
    }



    public void logout(String token) {
        restClient.post()
                .uri("/auth/logout")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .toBodilessEntity();
    }

}
