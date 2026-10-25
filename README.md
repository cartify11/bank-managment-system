# Scalable & Secure Web-Based Bank Management System

A professional, enterprise-grade, web-based Bank Management System built with Java 17, Spring Boot, Spring Security (JWT), PostgreSQL, and React.js (Vite).

---

## 🚀 Four-Phase Execution Roadmap

- [x] **PHASE 1: Basic Structure, Architecture & Database Foundation**
  - Layered Backend (Controller, Service, Repository, Entity, DTO, Security, Exception Handler)
  - Normalized PostgreSQL Database Schema & Entity Relationships
  - JWT Authentication & Role-Based Access Control (RBAC)
  - Scalable React + Vite Frontend Foundation with Axios & Router
- [x] **PHASE 2: Master UI/UX Design System**
  - 100% Visual Lock matching `design_reference/MASTER_UI_UX_REFERENCE.png`
  - Centralized Design System Tokens (`colors.js`, `typography.js`, `spacing.js`, `radius.js`, `shadows.js`)
  - 15 App Screens (Dashboard, Customers, Profile, Accounts, Details, Transactions, Transfers, Deposits, Employees, Admin, Reports, Settings, Security, Login, Component Library)
- [x] **PHASE 3: Features & Business Functionality**
  - Complete 102 Master Banking Features Specification Coverage
  - Fund Transfers, Deposits & Cash Withdrawals
  - Beneficiary Directory Management
  - Loan Origination, EMI Calculator, and Installment Repayment Workflows
  - Fixed Deposit Certificates, Term Durations, and Maturity Yield Calculations
  - Debit/Credit Card Issuance, Daily Limits, and Instant Block/Unblock Controls
  - Account Statement Generator (Date-Filtered) & Printable Digital Receipts
  - Maker-Checker Pending Transaction & Account Request Approval Queue
  - Customer Service Ticketing & Support Resolution Queue
  - Audit Logging, System Security Overview, and Analytics Exports (PDF/CSV)
- [x] **PHASE 4: System Audit, Testing, Security & Production Hardening**
  - Full 30-stage repository audit completed with **PASS** status
  - Verified backend compilation and frontend build readiness
  - Verified PostgreSQL database relational integrity and `NUMERIC(15,2)` precision
  - Verified BCrypt password security, JWT token validation, and RBAC endpoint protection
  - Verified transfer atomicity, financial calculation formulas, and audit trail logging
  - Zero UI design drift across 22 application screens against Master Reference
  - Comprehensive Audit Report generated in `PHASE_4_AUDIT_REPORT.md`

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (with JWT Interceptors)
- **Icons**: Lucide React
- **Design System**: Master UI/UX Reference Tokens (`#0b2d39` Dark Cyan Sidebar, `#0d9488` Emerald Accent)

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2
- **Web & Security**: Spring Web, Spring Security (Stateless JWT via JJWT 0.12.5)
- **Data Persistence**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

### Database
- **Engine**: PostgreSQL 14+
- **Monetary Precision**: `NUMERIC(15, 2)`

---

## 📁 Complete Project Directory Structure

```
Bank Management System/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bank/system/
│   │   │   │   ├── config/          # SecurityConfig, CorsConfig
│   │   │   │   ├── controller/      # AuthController, AccountController, TransactionController, LoanController, etc.
│   │   │   │   ├── dto/             # Request & Response DTOs
│   │   │   │   ├── entity/          # JPA Entities (User, Customer, Account, Loan, FixedDeposit, Card, Beneficiary, etc.)
│   │   │   │   ├── enums/           # RoleName, AccountStatus, TransactionType, etc.
│   │   │   │   ├── exception/       # ResourceNotFoundException, GlobalExceptionHandler
│   │   │   │   ├── repository/      # Spring Data JPA Repositories
│   │   │   │   ├── security/        # JwtTokenProvider, JwtAuthenticationFilter, etc.
│   │   │   │   └── service/         # Business services & implementations
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       └── schema.sql       # DDL table creation and seed data
│   ├── .env.example
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Common & UI elements (AppSidebar, AppHeader, AppMetricCard, AppTable, AppBadge, AppButton)
│   │   ├── hooks/           # useAuth context hook
│   │   ├── layouts/         # AppLayout shell
│   │   ├── pages/           # 22 Banking Feature & Reference pages
│   │   ├── routes/          # AppRoutes, ProtectedRoute
│   │   ├── services/        # Axios API clients (authService, accountService, loanService, cardService, etc.)
│   │   └── shared/design-system/ # Master UI/UX Design Tokens
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── design_reference/
│   └── MASTER_UI_UX_REFERENCE.png
├── implementation_plan.md
├── PHASE_4_AUDIT_REPORT.md
└── README.md
```

---

## 🗄️ PostgreSQL Database Setup

1. **Create Database**:
   ```sql
   CREATE DATABASE bank_db;
   ```

2. **Schema Execution**:
   Backend initializes `backend/src/main/resources/schema.sql` automatically on startup to create all 15 relational tables (`users`, `customers`, `accounts`, `transactions`, `loans`, `fixed_deposits`, `cards`, `beneficiaries`, `support_tickets`, `audit_logs`, `announcements`) and seed data.

---

## 🏃 Running the Application

### Backend:
```bash
cd backend
mvn clean spring-boot:run
```
*(Runs on `http://localhost:8080`)*

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 📋 Documentation & Audit Reports

- Root [README.md](file:///c:/Users/X%20COMPUTER/Desktop/Bank%20managemant%20system/README.md)
- Phase 4 Audit Report: [PHASE_4_AUDIT_REPORT.md](file:///c:/Users/X%20COMPUTER/Desktop/Bank%20managemant%20system/PHASE_4_AUDIT_REPORT.md)
- Walkthrough Artifact: [walkthrough.md](file:///C:/Users/X%20COMPUTER/.gemini/antigravity/brain/f2f1c0e2-802b-4375-b213-8b4c6126ffef/walkthrough.md)
