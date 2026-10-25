package com.bank.system.service;

import com.bank.system.dto.request.CreateAccountRequest;
import com.bank.system.dto.response.AccountResponse;
import com.bank.system.entity.Account;
import com.bank.system.entity.AccountType;
import com.bank.system.entity.Customer;
import com.bank.system.enums.AccountStatus;
import com.bank.system.exception.BadRequestException;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.AccountTypeRepository;
import com.bank.system.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final AccountTypeRepository accountTypeRepository;
    private final SecureRandom random = new SecureRandom();

    @Override
    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", request.getCustomerId()));

        AccountType accountType = accountTypeRepository.findByCode(request.getAccountTypeCode())
                .orElseThrow(() -> new ResourceNotFoundException("AccountType", "code", request.getAccountTypeCode()));

        if (request.getInitialDeposit().compareTo(accountType.getMinBalance()) < 0) {
            throw new BadRequestException("Initial deposit must be at least minimum balance of " + accountType.getMinBalance());
        }

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .customer(customer)
                .accountType(accountType)
                .balance(request.getInitialDeposit())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .status(AccountStatus.ACTIVE)
                .build();

        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountNumber", accountNumber));
        return mapToAccountResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long number = 1000000000L + (long) (random.nextDouble() * 9000000000L);
            accountNumber = "ACC" + number;
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .customerId(account.getCustomer().getId())
                .customerName(account.getCustomer().getFirstName() + " " + account.getCustomer().getLastName())
                .accountTypeCode(account.getAccountType().getCode())
                .accountTypeName(account.getAccountType().getName())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(account.getStatus())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
