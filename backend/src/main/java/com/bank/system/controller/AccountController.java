package com.bank.system.controller;

import com.bank.system.dto.request.CreateAccountRequest;
import com.bank.system.dto.response.AccountResponse;
import com.bank.system.dto.response.ApiResponse;
import com.bank.system.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse accountResponse = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", accountResponse));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved successfully", accounts));
    }

    @GetMapping("/{accountNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountByNumber(@PathVariable String accountNumber) {
        AccountResponse account = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account retrieved successfully", account));
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccountsByCustomerId(@PathVariable Long customerId) {
        List<AccountResponse> accounts = accountService.getAccountsByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success("Customer accounts retrieved successfully", accounts));
    }
}
