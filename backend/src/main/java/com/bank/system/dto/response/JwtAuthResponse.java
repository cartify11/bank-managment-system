package com.bank.system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthResponse {

    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserResponse user;
}
