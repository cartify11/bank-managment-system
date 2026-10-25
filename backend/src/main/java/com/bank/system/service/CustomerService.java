package com.bank.system.service;

import com.bank.system.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {
    List<CustomerResponse> getAllCustomers();
    CustomerResponse getCustomerById(Long id);
    CustomerResponse getCustomerByUserId(Long userId);
}
