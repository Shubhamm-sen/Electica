package com.polls.pojos.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.polls.pojos.dto.UserProfileDTO;
import com.polls.pojos.dto.UserResponseDTO;
import com.polls.pojos.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserProfileDTO request) {

        return ResponseEntity.ok(userService.updateUser(id, request));
    }
}
