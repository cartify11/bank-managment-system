package com.bank.system.controller;

import com.bank.system.dto.response.ApiResponse;
import com.bank.system.entity.AccountType;
import com.bank.system.repository.AccountTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account-types")
@RequiredArgsConstructor
public class AccountTypeController {

    private final AccountTypeRepository accountTypeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountType>>> getAllAccountTypes() {
        List<AccountType> types = accountTypeRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Account types retrieved successfully", types));
    }
}
