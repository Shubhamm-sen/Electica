package com.polls.pojos.serviceImpl;

import com.polls.pojos.User;
import com.polls.pojos.dto.UserResponseDTO;
import com.polls.pojos.exception.ResourceNotFoundException;
import com.polls.pojos.repository.UserRepository;
import com.polls.pojos.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDTO registerUser(User user) {
        try {
            User savedUser = userRepository.save(user);
            return mapToDTO(savedUser);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Email already exists, please login instead.");
        }
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));

        return mapToDTO(user);
    }

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
