package com.bank.system.controller;

import com.bank.system.dto.response.ApiResponse;
import com.bank.system.dto.response.CustomerResponse;
import com.bank.system.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", customers));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", customer));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerByUserId(@PathVariable Long userId) {
        CustomerResponse customer = customerService.getCustomerByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", customer));
    }
}
