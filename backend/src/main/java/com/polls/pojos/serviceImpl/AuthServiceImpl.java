package com.polls.pojos.serviceImpl;

import org.springframework.stereotype.Service;

import com.polls.pojos.User;
import com.polls.pojos.dto.LoginRequestDTO;
import com.polls.pojos.dto.LoginResponseDTO;
import com.polls.pojos.dto.SignupRequestDTO;
import com.polls.pojos.dto.UserResponseDTO;
import com.polls.pojos.exception.BusinessException;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final com.polls.pojos.security.JwtUtils jwtUtils;

    public AuthServiceImpl(UserRepository userRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
            org.springframework.security.authentication.AuthenticationManager authenticationManager,
            com.polls.pojos.security.JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    // ================= SIGNUP =================
    @Override
    public UserResponseDTO signup(SignupRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        User saved = userRepository.save(user);

        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(saved.getId());
        dto.setUsername(saved.getUsername());
        dto.setEmail(saved.getEmail());
        dto.setRole(saved.getRole());
        dto.setMessage("Signup successful");

        return dto;
    }

    // ================= LOGIN =================
    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        // Authenticate using Spring Security's AuthenticationManager
        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // If authentication successful, fetch user and generate token
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("User not found"));

        String token = jwtUtils.generateToken(user.getEmail());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setMessage("Login successful");
        response.setToken(token);

        return response;
    }
}
