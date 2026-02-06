package com.polls.pojos.service;

import com.polls.pojos.dto.LoginRequestDTO;
import com.polls.pojos.dto.LoginResponseDTO;
import com.polls.pojos.dto.SignupRequestDTO;

public interface AuthService {
	
	Object signup(SignupRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request);
}
