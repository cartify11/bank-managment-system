package com.bank.system.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotBlank(message = "Account type code is required (SAVINGS or CURRENT)")
    private String accountTypeCode;

    @NotNull(message = "Initial deposit amount is required")
    @DecimalMin(value = "0.00", message = "Initial deposit amount cannot be negative")
    private BigDecimal initialDeposit;

    private String currency;
}
