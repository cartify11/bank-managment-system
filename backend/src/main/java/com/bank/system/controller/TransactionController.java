package com.bank.system.controller;

import com.bank.system.dto.request.TransactionRequest;
import com.bank.system.dto.response.ApiResponse;
import com.bank.system.dto.response.TransactionResponse;
import com.bank.system.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<TransactionResponse>> processTransaction(@Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.processTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction processed successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.success("Transactions retrieved successfully", transactions));
    }

    @GetMapping("/reference/{reference}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionByReference(@PathVariable String reference) {
        TransactionResponse response = transactionService.getTransactionByReference(reference);
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", response));
    }

    @GetMapping("/account/{accountNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByAccount(@PathVariable String accountNumber) {
        List<TransactionResponse> transactions = transactionService.getTransactionsByAccountNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account transactions retrieved successfully", transactions));
    }
}
