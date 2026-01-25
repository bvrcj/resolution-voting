package com.example.resolutionvoting.controller;

import com.example.resolutionvoting.TestUtils;
import com.example.resolutionvoting.dto.CreateUserRequest;
import com.example.resolutionvoting.model.User;
import com.example.resolutionvoting.model.UserRole;
import com.example.resolutionvoting.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @Test
    void create_user_success() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Ada");
        request.setEmail("ada@example.com");
        request.setRole(UserRole.ADMIN);

        when(userRepository.findByEmail("ada@example.com")).thenReturn(Optional.empty());
        User saved = TestUtils.setId(new User("Ada", "ada@example.com", UserRole.ADMIN), 1L);
        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class))).thenReturn(saved);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("ada@example.com"));
    }

    @Test
    void create_user_duplicate_email() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Ada");
        request.setEmail("ada@example.com");
        request.setRole(UserRole.ADMIN);

        when(userRepository.findByEmail("ada@example.com"))
                .thenReturn(Optional.of(new User("Ada", "ada@example.com", UserRole.ADMIN)));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_user_validation_error() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Ada");
        request.setRole(UserRole.ADMIN);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void get_user_not_found() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_user_not_found() throws Exception {
        when(userRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNotFound());
    }
}
