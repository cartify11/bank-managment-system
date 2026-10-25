package com.bank.system.dto.response;

import com.bank.system.enums.TransactionStatus;
import com.bank.system.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private String transactionReference;
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private TransactionType transactionType;
    private BigDecimal amount;
    private BigDecimal fee;
    private TransactionStatus status;
    private String description;
    private ZonedDateTime createdAt;
}
