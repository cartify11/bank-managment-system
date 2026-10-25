package com.bank.system.service;

import com.bank.system.dto.request.TransactionRequest;
import com.bank.system.dto.response.TransactionResponse;
import com.bank.system.entity.Account;
import com.bank.system.entity.Transaction;
import com.bank.system.enums.AccountStatus;
import com.bank.system.enums.TransactionStatus;
import com.bank.system.enums.TransactionType;
import com.bank.system.exception.BadRequestException;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public TransactionResponse processTransaction(TransactionRequest request) {
        TransactionType type;
        try {
            type = TransactionType.valueOf(request.getTransactionType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid transaction type: " + request.getTransactionType());
        }

        Account source = null;
        Account target = null;
        String reference = UUID.randomUUID().toString();

        if (type == TransactionType.DEPOSIT) {
            if (request.getTargetAccountNumber() == null) {
                throw new BadRequestException("Target account number is required for DEPOSIT");
            }
            target = getActiveAccount(request.getTargetAccountNumber());
            target.setBalance(target.getBalance().add(request.getAmount()));
            accountRepository.save(target);

        } else if (type == TransactionType.WITHDRAWAL) {
            if (request.getSourceAccountNumber() == null) {
                throw new BadRequestException("Source account number is required for WITHDRAWAL");
            }
            source = getActiveAccount(request.getSourceAccountNumber());
            validateSufficientBalance(source, request.getAmount());
            source.setBalance(source.getBalance().subtract(request.getAmount()));
            accountRepository.save(source);

        } else if (type == TransactionType.TRANSFER) {
            if (request.getSourceAccountNumber() == null || request.getTargetAccountNumber() == null) {
                throw new BadRequestException("Both source and target account numbers are required for TRANSFER");
            }
            if (request.getSourceAccountNumber().equals(request.getTargetAccountNumber())) {
                throw new BadRequestException("Source and target accounts cannot be identical");
            }

            source = getActiveAccount(request.getSourceAccountNumber());
            target = getActiveAccount(request.getTargetAccountNumber());

            validateSufficientBalance(source, request.getAmount());

            source.setBalance(source.getBalance().subtract(request.getAmount()));
            target.setBalance(target.getBalance().add(request.getAmount()));

            accountRepository.save(source);
            accountRepository.save(target);
        }

        Transaction transaction = Transaction.builder()
                .transactionReference(reference)
                .sourceAccount(source)
                .targetAccount(target)
                .transactionType(type)
                .amount(request.getAmount())
                .fee(BigDecimal.ZERO)
                .status(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToTransactionResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionByReference(String reference) {
        Transaction tx = transactionRepository.findByTransactionReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "reference", reference));
        return mapToTransactionResponse(tx);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountNumber", accountNumber));

        return transactionRepository.findAllByAccountId(account.getId()).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    private Account getActiveAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account", "accountNumber", accountNumber));
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new BadRequestException("Account " + accountNumber + " is not ACTIVE");
        }
        return account;
    }

    private void validateSufficientBalance(Account account, BigDecimal amount) {
        BigDecimal available = account.getBalance().add(account.getAccountType().getOverdraftLimit());
        if (available.compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient funds in account " + account.getAccountNumber());
        }
    }

    private TransactionResponse mapToTransactionResponse(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .transactionReference(tx.getTransactionReference())
                .sourceAccountNumber(tx.getSourceAccount() != null ? tx.getSourceAccount().getAccountNumber() : null)
                .targetAccountNumber(tx.getTargetAccount() != null ? tx.getTargetAccount().getAccountNumber() : null)
                .transactionType(tx.getTransactionType())
                .amount(tx.getAmount())
                .fee(tx.getFee())
                .status(tx.getStatus())
                .description(tx.getDescription())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
