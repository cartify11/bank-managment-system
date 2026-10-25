package com.bank.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiErrorResponse {

    private int status;
    private String errorCode;
    private String message;
    private String path;
    private Map<String, String> errors;
    @Builder.Default
    private ZonedDateTime timestamp = ZonedDateTime.now();
}
