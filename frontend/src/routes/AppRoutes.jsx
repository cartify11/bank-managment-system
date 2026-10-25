import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import CustomerProfile from '../pages/CustomerProfile';
import Accounts from '../pages/Accounts';
import AccountDetails from '../pages/AccountDetails';
import Transactions from '../pages/Transactions';
import TransferMoney from '../pages/TransferMoney';
import DepositWithdrawal from '../pages/DepositWithdrawal';
import Loans from '../pages/Loans';
import FixedDeposits from '../pages/FixedDeposits';
import Cards from '../pages/Cards';
import Beneficiaries from '../pages/Beneficiaries';
import SupportTickets from '../pages/SupportTickets';
import Statements from '../pages/Statements';
import Approvals from '../pages/Approvals';
import Employees from '../pages/Employees';
import Users from '../pages/Users';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Security from '../pages/Security';
import ComponentLibrary from '../pages/ComponentLibrary';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import { ROLES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home */}
      <Route path="/" element={<Home />} />

      {/* Auth Screen */}
      <Route path="/login" element={<Login />} />

      {/* Main Authenticated App Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerProfile />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:accountNumber" element={<AccountDetails />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfers" element={<TransferMoney />} />
          <Route path="/deposits" element={<DepositWithdrawal />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/fixed-deposits" element={<FixedDeposits />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/tickets" element={<SupportTickets />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/components" element={<ComponentLibrary />} />

          {/* Role Restricted Admin Route */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/users" element={<Users />} />
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
