package com.bank.system.service;

import com.bank.system.dto.request.TransactionRequest;
import com.bank.system.dto.response.TransactionResponse;

import java.util.List;

public interface TransactionService {
    TransactionResponse processTransaction(TransactionRequest request);
    TransactionResponse getTransactionByReference(String reference);
    List<TransactionResponse> getTransactionsByAccountNumber(String accountNumber);
    List<TransactionResponse> getAllTransactions();
}
