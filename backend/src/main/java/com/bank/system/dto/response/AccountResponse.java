package com.bank.system.dto.response;

import com.bank.system.enums.AccountStatus;
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
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private Long customerId;
    private String customerName;
    private String accountTypeCode;
    private String accountTypeName;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private ZonedDateTime createdAt;
}
