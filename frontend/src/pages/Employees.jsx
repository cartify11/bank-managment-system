import React, { useState } from 'react';
import { colors, typography } from '../shared/design-system';
import AppCard from '../components/ui/AppCard';
import AppTable from '../components/ui/AppTable';
import AppBadge from '../components/ui/AppBadge';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppSelect from '../components/ui/AppSelect';
import AppModal from '../components/ui/AppModal';
import {
  UserPlus, Edit, Users, CheckCircle, Building2, Trash2,
  DollarSign, Printer, Calendar, Clock, CreditCard, CheckCircle2,
  AlertCircle, FileText
} from 'lucide-react';
import dataStore from '../services/dataStore';

export const Employees = () => {
  const [employees, setEmployees] = useState(() => dataStore.getEmployees());

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Payslip Modal State
  const [payslipEmp, setPayslipEmp] = useState(null);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);

  // Pay Salary Confirmation Modal State
  const [payingEmp, setPayingEmp] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [position, setPosition] = useState('Senior Teller');
  const [hireDate, setHireDate] = useState('');
  const [salary, setSalary] = useState('3000.00');
  const [status, setStatus] = useState('Active');

  const parseNum = (str) => parseFloat((str || '0').toString().replace(/[^0-9.]/g, '')) || 0;
  const formatMoney = (val) => `PKR ${Number(val).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Add Employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!name) return;

    const salaryFormatted = formatMoney(parseNum(salary));

    const newEmp = {
      id: Date.now(),
      code: `EMP-${100 + employees.length + 1}`,
      name,
      department,
      position,
      hireDate: hireDate || new Date().toISOString().split('T')[0],
      salary: salaryFormatted,
      attendance: 'Present',
      attendanceTime: '09:00 AM',
      salaryStatus: 'Pending',
      lastPaidDate: null,
      status: status || 'Active',
    };

    const updated = [newEmp, ...employees];
    setEmployees(updated);
    dataStore.saveEmployees(updated);

    // Reset Form
    setName('');
    setDepartment('Operations');
    setPosition('Senior Teller');
    setHireDate('');
    setSalary('3000.00');
    setStatus('Active');
    setAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setDepartment(emp.department);
    setPosition(emp.position);
    setHireDate(emp.hireDate);
    setSalary(emp.salary ? emp.salary.replace(/[^0-9.]/g, '') : '3000.00');
    setStatus(emp.status || 'Active');
    setEditModalOpen(true);
  };

  // Save Edit Changes
  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const salaryFormatted = formatMoney(parseNum(salary));

    const updated = employees.map(emp => emp.id === selectedEmp.id ? {
      ...emp,
      name,
      department,
      position,
      hireDate,
      salary: salaryFormatted,
      status
    } : emp);

    setEmployees(updated);
    dataStore.saveEmployees(updated);

    setName('');
    setSelectedEmp(null);
    setEditModalOpen(false);
  };

  // Delete Employee
  const handleDeleteEmployee = (empId) => {
    if (window.confirm('Are you sure you want to remove this employee record?')) {
      const updated = employees.filter(e => e.id !== empId);
      setEmployees(updated);
      dataStore.saveEmployees(updated);
      setEditModalOpen(false);
    }
  };

  // Toggle Attendance (Present / Absent / On Leave)
  const handleAttendanceChange = (empId, newAttendance) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        return {
          ...emp,
          attendance: newAttendance,
          attendanceTime: newAttendance === 'Present' ? (emp.attendanceTime !== '-' ? emp.attendanceTime : timeNow) : '-'
        };
      }
      return emp;
    });

    setEmployees(updated);
    dataStore.saveEmployees(updated);
  };

  // Process Salary Payment
  const handleConfirmPaySalary = () => {
    if (!payingEmp) return;

    const todayDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const updated = employees.map(emp => {
      if (emp.id === payingEmp.id) {
        return {
          ...emp,
          salaryStatus: 'Paid',
          lastPaidDate: todayDate
        };
      }
      return emp;
    });

    setEmployees(updated);
    dataStore.saveEmployees(updated);
    setPayModalOpen(false);

    // Prompt viewing payslip
    const updatedEmp = updated.find(e => e.id === payingEmp.id);
    if (updatedEmp) {
      setPayslipEmp(updatedEmp);
      setPayslipModalOpen(true);
    }
    setPayingEmp(null);
  };

  // KPI Calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const presentCount = employees.filter(e => e.attendance === 'Present').length;
  const absentCount = employees.filter(e => e.attendance === 'Absent').length;
  const leaveCount = employees.filter(e => e.attendance === 'On Leave').length;

  const totalPayrollBudget = employees.reduce((sum, e) => sum + parseNum(e.salary), 0);
  const totalPaidSalary = employees.filter(e => e.salaryStatus === 'Paid').reduce((sum, e) => sum + parseNum(e.salary), 0);
  const totalPendingSalary = employees.filter(e => e.salaryStatus === 'Pending').reduce((sum, e) => sum + parseNum(e.salary), 0);

  const columns = [
    {
      header: 'Employee Code',
      accessor: 'code',
      render: (row) => (
        <span style={{ fontWeight: typography.fontWeight.semibold, color: colors.primary, fontFamily: 'monospace' }}>
          {row.code}
        </span>
      )
    },
    {
      header: 'Name & Position',
      render: (row) => (
        <div>
          <div style={{ fontWeight: typography.fontWeight.semibold, color: '#2c1e16', fontSize: '0.95rem' }}>
            {row.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#7a6658' }}>
            {row.position} • <span style={{ color: '#87532a' }}>{row.department}</span>
          </div>
        </div>
      )
    },
    {
      header: "Today's Attendance",
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={row.attendance || 'Present'}
            onChange={(e) => handleAttendanceChange(row.id, e.target.value)}
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '6px',
              border: row.attendance === 'Present' ? '1px solid #86efac' : row.attendance === 'Absent' ? '1px solid #fca5a5' : '1px solid #fde047',
              background: row.attendance === 'Present' ? '#f0fdf4' : row.attendance === 'Absent' ? '#fef2f2' : '#fefce8',
              color: row.attendance === 'Present' ? '#166534' : row.attendance === 'Absent' ? '#991b1b' : '#854d0e',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="Present">🟢 Present</option>
            <option value="Absent">🔴 Absent</option>
            <option value="On Leave">🟡 On Leave</option>
          </select>
          {row.attendance === 'Present' && row.attendanceTime && row.attendanceTime !== '-' && (
            <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={12} /> {row.attendanceTime}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Monthly Salary',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#2c1e16', fontSize: '0.95rem' }}>
            {row.salary || 'PKR 3,000.00'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>Per Month</div>
        </div>
      )
    },
    {
      header: 'Salary Status (This Month)',
      render: (row) => (
        <div>
          {row.salaryStatus === 'Paid' ? (
            <div>
              <AppBadge variant="success">PAID ✓</AppBadge>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.2rem' }}>
                Paid on {row.lastPaidDate || 'Recent'}
              </div>
            </div>
          ) : (
            <div>
              <AppBadge variant="warning">PENDING ⏳</AppBadge>
              <div style={{ fontSize: '0.72rem', color: '#c2410c', marginTop: '0.2rem' }}>
                Awaiting Disbursal
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Actions & Payroll',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {row.salaryStatus === 'Pending' ? (
            <button
              onClick={() => { setPayingEmp(row); setPayModalOpen(true); }}
              style={{
                padding: '0.35rem 0.65rem',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <DollarSign size={14} /> Pay Salary
            </button>
          ) : (
            <button
              onClick={() => { setPayslipEmp(row); setPayslipModalOpen(true); }}
              style={{
                padding: '0.35rem 0.65rem',
                background: '#f1f5f9',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <FileText size={14} color="#2563eb" /> Payslip
            </button>
          )}

          <button
            onClick={() => handleOpenEdit(row)}
            style={{
              padding: '0.35rem 0.5rem',
              background: 'none',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              color: colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.78rem'
            }}
          >
            <Edit size={13} /> Edit
          </button>
        </div>
      )
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, color: '#2c1e16' }}>
            Employee Management & Payroll
          </h1>
          <div style={{ fontSize: typography.fontSize.xs, color: '#7a6658', marginTop: '0.2rem' }}>
            Staff directory, daily attendance tracking, monthly salary records, and payroll disbursal
          </div>
        </div>
        <AppButton variant="primary" icon={UserPlus} onClick={() => setAddModalOpen(true)}>Add Employee</AppButton>
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Total Staff */}
        <div style={{ background: '#ffffff', border: '1px solid #ebdccb', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5efe6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} color="#87532a" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Total Staff</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2c1e16' }}>{totalEmployees} Staff</div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>{activeEmployees} Active</div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={20} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Today's Attendance</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#16a34a' }}>{presentCount} Present</div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>
              {absentCount > 0 && <span style={{ color: '#dc2626' }}>{absentCount} Absent • </span>}
              {leaveCount > 0 && <span style={{ color: '#ca8a04' }}>{leaveCount} Leave</span>}
              {absentCount === 0 && leaveCount === 0 && <span style={{ color: '#16a34a' }}>100% Present</span>}
            </div>
          </div>
        </div>

        {/* Monthly Payroll Budget */}
        <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} color="#ea580c" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Monthly Payroll</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ea580c' }}>{formatMoney(totalPayrollBudget)}</div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658' }}>Total Monthly Budget</div>
          </div>
        </div>

        {/* Salary Disbursal Status */}
        <div style={{ background: '#ffffff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#0284c7" />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#7a6658', textTransform: 'uppercase' }}>Salary Disbursed</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0284c7' }}>{formatMoney(totalPaidSalary)}</div>
            <div style={{ fontSize: '0.72rem', color: totalPendingSalary > 0 ? '#ea580c' : '#16a34a' }}>
              {totalPendingSalary > 0 ? `${formatMoney(totalPendingSalary)} Pending` : 'All Salaries Paid ✓'}
            </div>
          </div>
        </div>
      </div>

      <AppCard title="Staff Directory, Attendance & Payroll">
        <AppTable columns={columns} data={employees} />
      </AppCard>

      {/* Add Employee Modal */}
      <AppModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Register New Bank Employee">
        <form onSubmit={handleAddEmployee}>
          <AppInput label="Employee Full Name" placeholder="e.g. Marcus Wright" value={name} onChange={(e) => setName(e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Customer Service', label: 'Customer Service' },
                { value: 'Compliance', label: 'Compliance & Risk' },
                { value: 'IT Support', label: 'IT Support & Security' },
                { value: 'Loan & Credit', label: 'Loan & Credit Department' },
              ]}
            />
            <AppInput label="Job Title / Position" placeholder="e.g. Senior Teller" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppInput
              label="Monthly Salary (PKR)"
              type="number"
              placeholder="3000.00"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <AppInput label="Hire Date" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
          </div>

          <AppSelect
            label="Employment Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive / On Leave' },
            ]}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <AppButton variant="secondary" onClick={() => setAddModalOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="primary">Add Employee</AppButton>
          </div>
        </form>
      </AppModal>

      {/* Edit Employee Modal */}
      <AppModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Employee Details">
        <form onSubmit={handleUpdateEmployee}>
          <AppInput label="Employee Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppSelect
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={[
                { value: 'Operations', label: 'Operations' },
                { value: 'Customer Service', label: 'Customer Service' },
                { value: 'Compliance', label: 'Compliance & Risk' },
                { value: 'IT Support', label: 'IT Support & Security' },
                { value: 'Loan & Credit', label: 'Loan & Credit Department' },
              ]}
            />
            <AppInput label="Job Title / Position" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AppInput
              label="Monthly Salary (PKR)"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
            <AppInput label="Hire Date" type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
          </div>

          <AppSelect
            label="Employment Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive / On Leave' },
            ]}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => selectedEmp && handleDeleteEmployee(selectedEmp.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem'
              }}
            >
              <Trash2 size={16} /> Remove Employee
            </button>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <AppButton variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</AppButton>
              <AppButton type="submit" variant="primary">Save Changes</AppButton>
            </div>
          </div>
        </form>
      </AppModal>

      {/* Pay Salary Confirmation Modal */}
      {payingEmp && (
        <AppModal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} title="Confirm Salary Disbursal">
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <DollarSign size={28} color="#16a34a" />
              </div>
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>Disburse Monthly Salary</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>
                Authorizing monthly salary payment to employee bank account
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Employee:</span>
                <strong style={{ color: '#0f172a' }}>{payingEmp.name} ({payingEmp.code})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Position & Department:</span>
                <span style={{ color: '#0f172a' }}>{payingEmp.position} - {payingEmp.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Pay Period:</span>
                <span style={{ color: '#0f172a' }}>September 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ color: '#0f172a', fontWeight: 'bold' }}>Net Salary Amount:</span>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1rem' }}>{payingEmp.salary}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <AppButton variant="secondary" onClick={() => setPayModalOpen(false)}>Cancel</AppButton>
              <AppButton variant="primary" onClick={handleConfirmPaySalary}>
                Confirm & Disburse Payment
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}

      {/* Official Printable Salary Slip / Payslip Modal */}
      {payslipEmp && (
        <AppModal isOpen={payslipModalOpen} onClose={() => setPayslipModalOpen(false)} title="Official Bank Salary Slip (Payslip)">
          <div style={{ padding: '1rem', background: '#ffffff', color: '#1f2937' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #87532a', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.2rem 0', color: '#2c1e16', fontSize: '1.35rem' }}>ENTERPRISE COMMERCIAL BANK</h2>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>HUMAN RESOURCES & PAYROLL DIVISION</div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Official Salary Payment Certificate & Advice</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>PAY PERIOD:</div>
                <div style={{ fontWeight: 'bold', color: '#2c1e16', fontSize: '1rem' }}>September 2026</div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 'bold' }}>STATUS: PAID ✓</div>
              </div>
            </div>

            {/* Employee Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>EMPLOYEE NAME</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1rem' }}>{payslipEmp.name}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Code: <strong>{payslipEmp.code}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>POSITION & DEPARTMENT</div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>{payslipEmp.position}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Dept: {payslipEmp.department}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>PAYMENT DATE</div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>{payslipEmp.lastPaidDate || '09/01/2026'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>PAYMENT METHOD</div>
                <div style={{ fontWeight: '600', color: '#0f172a' }}>Direct Deposit (Staff Account)</div>
              </div>
            </div>

            {/* Salary Breakdown Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Earnings & Allowance Description</th>
                    <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right' }}>Amount (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.55rem 0.8rem' }}>Basic Salary (70%)</td>
                    <td style={{ padding: '0.55rem 0.8rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatMoney(parseNum(payslipEmp.salary) * 0.7)}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.55rem 0.8rem' }}>House Rent Allowance (20%)</td>
                    <td style={{ padding: '0.55rem 0.8rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatMoney(parseNum(payslipEmp.salary) * 0.2)}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.55rem 0.8rem' }}>Medical & Utility Allowance (10%)</td>
                    <td style={{ padding: '0.55rem 0.8rem', textAlign: 'right', fontWeight: '500' }}>
                      {formatMoney(parseNum(payslipEmp.salary) * 0.1)}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                    <td style={{ padding: '0.55rem 0.8rem' }}>Tax / Health Insurance Deductions</td>
                    <td style={{ padding: '0.55rem 0.8rem', textAlign: 'right' }}>$0.00</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                    <td style={{ padding: '0.75rem 0.8rem', fontSize: '0.95rem', color: '#0f172a' }}>
                      NET SALARY DISBURSED
                    </td>
                    <td style={{ padding: '0.75rem 0.8rem', textAlign: 'right', color: '#16a34a', fontSize: '1.1rem' }}>
                      {payslipEmp.salary}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature & Authorization Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '35px', borderBottom: '1px solid #94a3b8', width: '80%', margin: '0 auto 0.4rem auto' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>HR & Payroll Manager</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Authorized Signatory</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ height: '35px', borderBottom: '1px solid #94a3b8', width: '80%', margin: '0 auto 0.4rem auto' }}></div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>Employee Acceptance</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{payslipEmp.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <AppButton variant="secondary" onClick={() => setPayslipModalOpen(false)}>Close</AppButton>
              <AppButton variant="primary" icon={Printer} onClick={() => window.print()}>Print Salary Slip</AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default Employees;


