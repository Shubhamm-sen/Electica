package com.polls.pojos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.polls.pojos.User;
import com.polls.pojos.dto.UserResponseDTO;
import com.polls.pojos.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }
}
