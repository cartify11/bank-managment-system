package com.bank.system.repository;

import com.bank.system.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {
    List<FixedDeposit> findByAccountId(Long accountId);
}
