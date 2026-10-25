package com.bank.system.service;

import com.bank.system.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
}
