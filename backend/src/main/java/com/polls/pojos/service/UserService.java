package com.polls.pojos.service;

import com.polls.pojos.dto.LoginRequestDTO;
import com.polls.pojos.dto.SignupRequestDTO;
import com.polls.pojos.dto.UserProfileDTO;
import com.polls.pojos.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO registerUser(SignupRequestDTO request);

    UserResponseDTO login(LoginRequestDTO request);

    UserResponseDTO getUserById(Long userId);

    UserResponseDTO updateUser(Long userId, UserProfileDTO userProfileDTO);
}
