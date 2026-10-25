package com.bank.system.service;

import com.bank.system.dto.request.LoginRequest;
import com.bank.system.dto.request.RegisterRequest;
import com.bank.system.dto.response.CustomerResponse;
import com.bank.system.dto.response.JwtAuthResponse;
import com.bank.system.dto.response.UserResponse;

public interface AuthService {
    JwtAuthResponse login(LoginRequest loginRequest);
    CustomerResponse registerCustomer(RegisterRequest registerRequest);
    UserResponse getCurrentUser(String usernameOrEmail);
}
