package com.bank.system.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "card_number", nullable = false, unique = true, length = 20)
    private String cardNumber;

    @Column(name = "card_type", nullable = false, length = 20)
    private String cardType;

    @Column(name = "expiry_date", nullable = false, length = 7)
    private String expiryDate;

    @Column(name = "daily_limit", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal dailyLimit = new BigDecimal("5000.00");

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
