package com.bank.system.service;

import com.bank.system.dto.response.CustomerResponse;
import com.bank.system.entity.Customer;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToCustomerResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return mapToCustomerResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerByUserId(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "userId", userId));
        return mapToCustomerResponse(customer);
    }

    private CustomerResponse mapToCustomerResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .userId(customer.getUser().getId())
                .username(customer.getUser().getUsername())
                .email(customer.getUser().getEmail())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .phoneNumber(customer.getPhoneNumber())
                .dateOfBirth(customer.getDateOfBirth())
                .nationalIdSsn(customer.getNationalIdSsn())
                .addressLine1(customer.getAddressLine1())
                .addressLine2(customer.getAddressLine2())
                .city(customer.getCity())
                .state(customer.getState())
                .postalCode(customer.getPostalCode())
                .country(customer.getCountry())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
