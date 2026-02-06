package com.polls.pojos.serviceImpl;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.polls.pojos.User;
import com.polls.pojos.dto.LoginRequestDTO;
import com.polls.pojos.dto.SignupRequestDTO;
import com.polls.pojos.dto.UserProfileDTO;
import com.polls.pojos.dto.UserResponseDTO;
import com.polls.pojos.exception.BusinessException;
import com.polls.pojos.exception.ResourceNotFoundException;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= REGISTER =================
    @Override
    public UserResponseDTO registerUser(SignupRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // plain for now
        user.setRole("USER"); // ✅ string role

        try {
            User savedUser = userRepository.save(user);
            return mapToDTO(savedUser);
        } catch (DataIntegrityViolationException ex) {
            throw new BusinessException("Invalid signup data");
        }
    }

    // ================= GET USER =================
    @Override
    public UserResponseDTO getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id " + userId));

        return mapToDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long userId, UserProfileDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already taken");
        }

        // For simplicity, checking if username exists is often done too, but skipping
        // strict check or assuming unique constraint handles it (catch DataIntegrity if
        // needed)
        // Generally good to check:
        // if (!user.getUsername().equals(request.getUsername()) &&
        // userRepository.existsByUsername(request.getUsername())) ...

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }

    // ================= LOGIN =================
    @Override
    public UserResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BusinessException("Invalid email or password");
        }

        return mapToDTO(user);
    }

    // ================= MAPPER =================
    private UserResponseDTO mapToDTO(User user) {

        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());

        return dto;
    }
}
