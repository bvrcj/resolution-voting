package com.lsvt.resolutionvoting.controller;

import com.lsvt.resolutionvoting.TestUtils;
import com.lsvt.resolutionvoting.dto.CreateUserRequest;
import com.lsvt.resolutionvoting.dto.UpdateUserRequest;
import com.lsvt.resolutionvoting.model.User;
import com.lsvt.resolutionvoting.model.UserRole;
import com.lsvt.resolutionvoting.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
        request.setEmail("SivaVishnu@lsvt.com");
        request.setRole(UserRole.ADMIN);

        when(userRepository.findByEmail("SivaVishnu@lsvt.com")).thenReturn(Optional.empty());
        User saved = TestUtils.setId(new User("Ada", "SivaVishnu@lsvt.com", UserRole.ADMIN), 1L);
        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class))).thenReturn(saved);

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("SivaVishnu@lsvt.com"));
    }

    @Test
    void create_user_duplicate_email() throws Exception {
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Ada");
        request.setEmail("SivaVishnu@lsvt.com");
        request.setRole(UserRole.ADMIN);

        when(userRepository.findByEmail("SivaVishnu@lsvt.com"))
                .thenReturn(Optional.of(new User("Ada", "SivaVishnu@lsvt.com", UserRole.ADMIN)));

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
    void list_users() throws Exception {
        when(userRepository.findAll()).thenReturn(List.of(
                TestUtils.setId(new User("Ada", "SivaVishnu@lsvt.com", UserRole.ADMIN), 1L)
        ));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void get_user_success() throws Exception {
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(TestUtils.setId(new User("Ada", "SivaVishnu@lsvt.com", UserRole.ADMIN), 1L)));

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("SivaVishnu@lsvt.com"));
    }

    @Test
    void update_user_success() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setName("Ada Updated");
        request.setEmail("ada@lsvt.com");
        request.setRole(UserRole.USER);

        User existing = TestUtils.setId(new User("Ada", "ada@lsvt.com", UserRole.ADMIN), 1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.findByEmail("ada@lsvt.com")).thenReturn(Optional.of(existing));
        when(userRepository.save(existing)).thenReturn(existing);

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ada@lsvt.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void update_user_duplicate_email_rejected() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setName("Ada Updated");
        request.setEmail("duplicate@lsvt.com");
        request.setRole(UserRole.USER);

        User existing = TestUtils.setId(new User("Ada", "ada@lsvt.com", UserRole.ADMIN), 1L);
        User other = TestUtils.setId(new User("Other", "duplicate@lsvt.com", UserRole.USER), 2L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.findByEmail("duplicate@lsvt.com")).thenReturn(Optional.of(other));

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_user_not_found() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setName("Ada Updated");
        request.setEmail("ada@lsvt.com");
        request.setRole(UserRole.USER);

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_user_not_found() throws Exception {
        when(userRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_user_success() throws Exception {
        when(userRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }
}



