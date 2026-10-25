package com.bank.system.repository;

import com.bank.system.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Boolean existsByEmployeeCode(String employeeCode);
}
