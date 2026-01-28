package com.polls.pojos.service;

import com.polls.pojos.User;
import com.polls.pojos.dto.UserResponseDTO;

public interface UserService {

    UserResponseDTO registerUser(User user);

    UserResponseDTO getUserById(Long userId);
}
