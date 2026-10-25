package com.bank.system.service;

import com.bank.system.dto.request.LoginRequest;
import com.bank.system.dto.request.RegisterRequest;
import com.bank.system.dto.response.CustomerResponse;
import com.bank.system.dto.response.JwtAuthResponse;
import com.bank.system.dto.response.UserResponse;
import com.bank.system.entity.Customer;
import com.bank.system.entity.Role;
import com.bank.system.entity.User;
import com.bank.system.enums.RoleName;
import com.bank.system.exception.DuplicateResourceException;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.CustomerRepository;
import com.bank.system.repository.RoleRepository;
import com.bank.system.repository.UserRepository;
import com.bank.system.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(
                loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "usernameOrEmail", loginRequest.getUsernameOrEmail()));

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .role(user.getRole().getName().name())
                .createdAt(user.getCreatedAt())
                .build();

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }

    @Override
    @Transactional
    public CustomerResponse registerCustomer(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("User", "username", registerRequest.getUsername());
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("User", "email", registerRequest.getEmail());
        }

        if (customerRepository.existsByNationalIdSsn(registerRequest.getNationalIdSsn())) {
            throw new DuplicateResourceException("Customer", "nationalIdSsn", registerRequest.getNationalIdSsn());
        }

        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", RoleName.ROLE_CUSTOMER));

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .role(customerRole)
                .enabled(true)
                .locked(false)
                .build();

        User savedUser = userRepository.save(user);

        Customer customer = Customer.builder()
                .user(savedUser)
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .dateOfBirth(registerRequest.getDateOfBirth())
                .nationalIdSsn(registerRequest.getNationalIdSsn())
                .addressLine1(registerRequest.getAddressLine1())
                .addressLine2(registerRequest.getAddressLine2())
                .city(registerRequest.getCity())
                .state(registerRequest.getState())
                .postalCode(registerRequest.getPostalCode())
                .country(registerRequest.getCountry())
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        return mapToCustomerResponse(savedCustomer);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "usernameOrEmail", usernameOrEmail));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .role(user.getRole().getName().name())
                .createdAt(user.getCreatedAt())
                .build();
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
