package com.bank.system.controller;

import com.bank.system.dto.request.LoginRequest;
import com.bank.system.dto.request.RegisterRequest;
import com.bank.system.dto.response.ApiResponse;
import com.bank.system.dto.response.CustomerResponse;
import com.bank.system.dto.response.JwtAuthResponse;
import com.bank.system.dto.response.UserResponse;
import com.bank.system.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("User logged in successfully", authResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CustomerResponse>> registerCustomer(@Valid @RequestBody RegisterRequest registerRequest) {
        CustomerResponse customerResponse = authService.registerCustomer(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer registered successfully", customerResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserResponse userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", userResponse));
    }
}
