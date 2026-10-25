package com.bank.system.service;

import com.bank.system.dto.request.CreateAccountRequest;
import com.bank.system.dto.response.AccountResponse;

import java.util.List;

public interface AccountService {
    AccountResponse createAccount(CreateAccountRequest request);
    AccountResponse getAccountByNumber(String accountNumber);
    List<AccountResponse> getAccountsByCustomerId(Long customerId);
    List<AccountResponse> getAllAccounts();
}
