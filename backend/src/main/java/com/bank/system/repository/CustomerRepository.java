package com.bank.system.repository;

import com.bank.system.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    Optional<Customer> findByNationalIdSsn(String nationalIdSsn);
    Boolean existsByNationalIdSsn(String nationalIdSsn);
}
