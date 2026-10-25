-- Schema definitions and seed data for Bank Management System (Phase 3 Complete)

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    locked BOOLEAN DEFAULT FALSE NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    national_id_ssn VARCHAR(50) UNIQUE NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account_types (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    min_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    interest_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.0000,
    overdraft_limit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    account_type_id BIGINT NOT NULL REFERENCES account_types(id),
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(36) UNIQUE NOT NULL,
    source_account_id BIGINT REFERENCES accounts(id),
    target_account_id BIGINT REFERENCES accounts(id),
    transaction_type VARCHAR(20) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Phase 3 Additions: Beneficiaries, Fixed Deposits, Loans, Cards, Support Tickets, Audit Logs, Announcements

CREATE TABLE IF NOT EXISTS beneficiaries (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL DEFAULT 'Enterprise Bank',
    branch_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fixed_deposits (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    principal_amount NUMERIC(15, 2) NOT NULL,
    duration_months INT NOT NULL,
    interest_rate NUMERIC(5, 4) NOT NULL,
    maturity_amount NUMERIC(15, 2) NOT NULL,
    maturity_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    loan_type VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    interest_rate NUMERIC(5, 4) NOT NULL,
    term_months INT NOT NULL,
    monthly_installment NUMERIC(15, 2) NOT NULL,
    outstanding_balance NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loan_repayments (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL REFERENCES loans(id),
    amount NUMERIC(15, 2) NOT NULL,
    repayment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED'
);

CREATE TABLE IF NOT EXISTS cards (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    card_number VARCHAR(20) UNIQUE NOT NULL,
    card_type VARCHAR(20) NOT NULL,
    expiry_date VARCHAR(7) NOT NULL,
    daily_limit NUMERIC(15, 2) NOT NULL DEFAULT 5000.00,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    ticket_number VARCHAR(36) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    assigned_to_employee_id BIGINT REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_customer_id ON accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(transaction_reference);
CREATE INDEX IF NOT EXISTS idx_transactions_source ON transactions(source_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_target ON transactions(target_account_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_customer ON beneficiaries(customer_id);
CREATE INDEX IF NOT EXISTS idx_loans_customer ON loans(customer_id);
CREATE INDEX IF NOT EXISTS idx_cards_account ON cards(account_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);

-- Initial seed data for system roles
INSERT INTO roles (id, name, description)
VALUES 
    (1, 'ROLE_SUPER_ADMIN', 'Super Administrator with full master configuration access'),
    (2, 'ROLE_ADMIN', 'System Administrator with management access'),
    (3, 'ROLE_BANK_MANAGER', 'Bank Manager approving high-value operations'),
    (4, 'ROLE_BRANCH_MANAGER', 'Branch Manager with local branch jurisdiction'),
    (5, 'ROLE_EMPLOYEE', 'Bank Employee handling customer operations'),
    (6, 'ROLE_TELLER', 'Bank Teller executing deposit and withdrawal transactions'),
    (7, 'ROLE_AUDITOR', 'Auditor with read-only inspection access to security logs and reports'),
    (8, 'ROLE_CUSTOMER', 'Bank Customer with self-service account access')
ON CONFLICT (id) DO NOTHING;

-- Initial seed data for standard account types
INSERT INTO account_types (id, code, name, min_balance, interest_rate, overdraft_limit, description)
VALUES
    (1, 'SAVINGS', 'Savings Account', 100.00, 0.0350, 0.00, 'Standard interest-bearing savings account'),
    (2, 'CURRENT', 'Current / Checking Account', 500.00, 0.0000, 1000.00, 'Transactional checking account with overdraft facility')
ON CONFLICT (id) DO NOTHING;
