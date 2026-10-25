// Central persistent data store for Bank Management System UI mode
// MULTI-TIER PERSISTENCE ENGINE:
// Tier 1: localStorage (Primary fast sync)
// Tier 2: sessionStorage (Second memory mirror)
// Tier 3: IndexedDB (Permanent browser disk database)

// ============================================================
// ZERO-DEMO CLEAN INITIAL STATE (All tables start clean & empty)
// ============================================================

const INITIAL_CUSTOMERS = [];
const INITIAL_ACCOUNTS = [];
const INITIAL_TRANSACTIONS = [];
const INITIAL_EMPLOYEES = [];
const INITIAL_USERS = [];
const INITIAL_LOANS = [];
const INITIAL_FIXED_DEPOSITS = [];
const INITIAL_CARDS = [];
const INITIAL_BENEFICIARIES = [];
const INITIAL_TICKETS = [];
const INITIAL_APPROVALS = [];

// ============================================================
// INDEXEDDB ENGINE
// ============================================================

const DB_NAME = 'BMS_Permanent_Storage_V1';
const DB_STORE = 'app_data';

const getIDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => resolve(null);
  });
};

const saveToIDB = async (key, data) => {
  const db = await getIDB();
  if (!db) return;
  try {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(data, key);
  } catch (e) {
    console.warn('IDB write failed:', e);
  }
};

const readFromIDB = async (key) => {
  const db = await getIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
};

// ============================================================
// ONE-TIME PURGE OF OLD DEMO DATA
// Clears previously stored sample records from the user's browser
// ============================================================
const CLEAN_DATA_FLAG = 'bms_clean_purge_complete_v4';

if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(CLEAN_DATA_FLAG) !== 'true') {
      const keysToPurge = [
        'bms_customers',
        'bms_accounts',
        'bms_transactions',
        'bms_employees',
        'bms_users',
        'bms_loans',
        'bms_fixed_deposits',
        'bms_cards',
        'bms_beneficiaries',
        'bms_tickets',
        'bms_approvals',
        'bms_master_archive',
        'bms_master_archive_v1',
      ];
      keysToPurge.forEach((k) => {
        try { localStorage.removeItem(k); } catch (e) {}
        try { sessionStorage.removeItem(k); } catch (e) {}
        try { sessionStorage.removeItem('bms_ss_' + k.replace('bms_', '')); } catch (e) {}
      });

      // Purge IndexedDB object store
      if (window.indexedDB) {
        const req = indexedDB.open(DB_NAME, 1);
        req.onsuccess = (e) => {
          try {
            const db = e.target.result;
            if (db.objectStoreNames.contains(DB_STORE)) {
              const tx = db.transaction(DB_STORE, 'readwrite');
              tx.objectStore(DB_STORE).clear();
            }
          } catch (e) {}
        };
      }

      localStorage.setItem(CLEAN_DATA_FLAG, 'true');
    }
  } catch (e) {}
}

// ============================================================
// MULTI-LAYER READ / WRITE
// ============================================================

const LS_PREFIX = 'bms_';
const SS_PREFIX = 'bms_ss_';
const MASTER_BACKUP_KEY = 'bms_master_archive_v1';

const multiSave = (key, data) => {
  const json = JSON.stringify(data);

  // 1. localStorage
  try { localStorage.setItem(LS_PREFIX + key, json); } catch (e) {}

  // 2. sessionStorage
  try { sessionStorage.setItem(SS_PREFIX + key, json); } catch (e) {}

  // 3. IndexedDB
  saveToIDB(key, data);

  // 4. Master Archive in localStorage
  try {
    const masterStr = localStorage.getItem(MASTER_BACKUP_KEY);
    const masterObj = masterStr ? JSON.parse(masterStr) : {};
    masterObj[key] = data;
    masterObj.lastUpdated = new Date().toISOString();
    localStorage.setItem(MASTER_BACKUP_KEY, JSON.stringify(masterObj));
  } catch (e) {}

  // 5. Broadcast change event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bms_data_changed', { detail: { key, data } }));
  }
};

const multiRead = (key, defaultData) => {
  let loadedData = null;

  // 1. Try localStorage
  try {
    const lsItem = localStorage.getItem(LS_PREFIX + key);
    if (lsItem) loadedData = JSON.parse(lsItem);
  } catch (e) {}

  // 2. Try sessionStorage
  if (!loadedData) {
    try {
      const ssItem = sessionStorage.getItem(SS_PREFIX + key);
      if (ssItem) loadedData = JSON.parse(ssItem);
    } catch (e) {}
  }

  // 3. Try Master Archive
  if (!loadedData) {
    try {
      const masterStr = localStorage.getItem(MASTER_BACKUP_KEY);
      if (masterStr) {
        const masterObj = JSON.parse(masterStr);
        if (masterObj && masterObj[key]) {
          loadedData = masterObj[key];
        }
      }
    } catch (e) {}
  }

  if (loadedData !== null && loadedData !== undefined && Array.isArray(loadedData)) {
    return loadedData;
  }

  return defaultData || [];
};

// ============================================================
// HELPER MONEY FORMATTER
// ============================================================

export const toPKR = (val) => {
  if (val === null || val === undefined || val === '') return 'PKR 0.00';
  const str = val.toString().trim();
  if (str.startsWith('PKR')) return str;
  if (str.startsWith('Rs.')) return str.replace(/^Rs\.\s*/, 'PKR ');
  if (str.startsWith('$')) return str.replace(/^\$\s*/, 'PKR ');
  const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
  if (!isNaN(num)) {
    return `PKR ${num.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return str;
};

// ============================================================
// PUBLIC DATASTORE API
// ============================================================

export const dataStore = {
  // Clear all data manually
  clearAllData: () => {
    const keys = [
      'customers', 'accounts', 'transactions', 'employees',
      'users', 'loans', 'fixed_deposits', 'cards',
      'beneficiaries', 'tickets', 'approvals'
    ];
    keys.forEach(k => multiSave(k, []));
  },

  // Customers
  getCustomers: () => multiRead('customers', INITIAL_CUSTOMERS),
  saveCustomers: (data) => multiSave('customers', data),

  // Accounts
  getAccounts: () => {
    const raw = multiRead('accounts', INITIAL_ACCOUNTS);
    return raw.map(a => ({
      ...a,
      currency: 'PKR',
      balance: toPKR(a.balance)
    }));
  },
  saveAccounts: (data) => multiSave('accounts', data),

  // Transactions
  getTransactions: () => {
    const raw = multiRead('transactions', INITIAL_TRANSACTIONS);
    return raw.map(t => ({
      ...t,
      amount: toPKR(t.amount),
      fee: toPKR(t.fee || '0')
    }));
  },
  saveTransactions: (data) => multiSave('transactions', data),

  executeTransaction: (tx) => {
    const currentTx = multiRead('transactions', INITIAL_TRANSACTIONS);
    const currentAccounts = multiRead('accounts', INITIAL_ACCOUNTS);
    const currentCustomers = multiRead('customers', INITIAL_CUSTOMERS);

    const numAmount = parseFloat((tx.amount || '0').toString().replace(/[^0-9.]/g, '')) || 0;
    const feeVal = parseFloat((tx.fee || '0').toString().replace(/[^0-9.]/g, '')) || 0;

    const parseBal = (balStr) => parseFloat((balStr || '0').toString().replace(/[^0-9.]/g, '')) || 0;
    const formatMoney = (val) => `PKR ${val.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let updatedAccounts = currentAccounts.map(acc => {
      let bal = parseBal(acc.balance);

      if ((tx.type === 'DEPOSIT' || tx.type === 'TRANSFER') && tx.target && acc.accountNumber === tx.target) {
        bal += numAmount;
      }

      if ((tx.type === 'WITHDRAWAL' || tx.type === 'TRANSFER' || tx.type === 'FIXED_DEPOSIT') && tx.source && acc.accountNumber === tx.source) {
        bal = Math.max(0, bal - numAmount - feeVal);
      }

      return { ...acc, currency: 'PKR', balance: formatMoney(bal) };
    });

    const targetAccObj = currentAccounts.find(a => a.accountNumber === tx.target);
    const sourceAccObj = currentAccounts.find(a => a.accountNumber === tx.source);
    const accObj = targetAccObj || sourceAccObj;
    const matchedCustomer = accObj ? currentCustomers.find(c => c.name?.toLowerCase() === accObj.customerName?.toLowerCase()) : null;

    const resolvedName = tx.name || accObj?.customerName || 'Customer';
    const resolvedEmail = tx.email || matchedCustomer?.email || `${resolvedName.toLowerCase().replace(/\s+/g, '')}@example.com`;
    const resolvedId = tx.id || tx.ref || `TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const enrichedTx = {
      ...tx,
      id: resolvedId,
      name: resolvedName,
      email: resolvedEmail,
      amount: toPKR(tx.amount),
      fee: toPKR(tx.fee || '0'),
    };

    multiSave('accounts', updatedAccounts);
    const updatedTx = [enrichedTx, ...currentTx];
    multiSave('transactions', updatedTx);

    return { accounts: updatedAccounts, transactions: updatedTx };
  },

  // Employees
  getEmployees: () => {
    const raw = multiRead('employees', INITIAL_EMPLOYEES);
    return raw.map(e => ({
      ...e,
      salary: toPKR(e.salary || 'PKR 0.00'),
      attendance: e.attendance || 'Present',
      attendanceTime: e.attendanceTime || '09:00 AM',
      salaryStatus: e.salaryStatus || 'Paid',
      lastPaidDate: e.lastPaidDate || new Date().toLocaleDateString('en-US'),
    }));
  },
  saveEmployees: (data) => multiSave('employees', data),

  // Users
  getUsers: () => multiRead('users', INITIAL_USERS),
  saveUsers: (data) => multiSave('users', data),

  // Loans
  getLoans: () => {
    const raw = multiRead('loans', INITIAL_LOANS);
    return raw.map(l => ({
      ...l,
      amount: toPKR(l.amount),
      installment: toPKR(l.installment),
      outstanding: toPKR(l.outstanding),
      repaymentsHistory: (l.repaymentsHistory || []).map(r => ({
        ...r,
        amount: toPKR(r.amount),
        balanceAfter: toPKR(r.balanceAfter)
      }))
    }));
  },
  saveLoans: (data) => multiSave('loans', data),

  // Fixed Deposits
  getFixedDeposits: () => {
    const raw = multiRead('fixed_deposits', INITIAL_FIXED_DEPOSITS);
    return raw.map(f => ({
      ...f,
      principal: toPKR(f.principal),
      maturityAmount: toPKR(f.maturityAmount)
    }));
  },
  saveFixedDeposits: (data) => multiSave('fixed_deposits', data),

  // Cards
  getCards: () => {
    const raw = multiRead('cards', INITIAL_CARDS);
    return raw.map(c => ({
      ...c,
      limit: toPKR(c.limit)
    }));
  },
  saveCards: (data) => multiSave('cards', data),

  // Beneficiaries
  getBeneficiaries: () => multiRead('beneficiaries', INITIAL_BENEFICIARIES),
  saveBeneficiaries: (data) => multiSave('beneficiaries', data),

  // Tickets
  getTickets: () => multiRead('tickets', INITIAL_TICKETS),
  saveTickets: (data) => multiSave('tickets', data),

  // Approvals
  getApprovals: () => multiRead('approvals', INITIAL_APPROVALS),
  saveApprovals: (data) => multiSave('approvals', data),

  // Backup Export
  exportBackup: () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      customers: multiRead('customers', []),
      accounts: multiRead('accounts', []),
      transactions: multiRead('transactions', []),
      employees: multiRead('employees', []),
      users: multiRead('users', []),
      loans: multiRead('loans', []),
      fixed_deposits: multiRead('fixed_deposits', []),
      cards: multiRead('cards', []),
      beneficiaries: multiRead('beneficiaries', []),
      tickets: multiRead('tickets', []),
      approvals: multiRead('approvals', []),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Backup Import
  importBackup: (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.customers)      multiSave('customers', data.customers);
      if (data.accounts)       multiSave('accounts', data.accounts);
      if (data.transactions)   multiSave('transactions', data.transactions);
      if (data.employees)      multiSave('employees', data.employees);
      if (data.users)          multiSave('users', data.users);
      if (data.loans)          multiSave('loans', data.loans);
      if (data.fixed_deposits) multiSave('fixed_deposits', data.fixed_deposits);
      if (data.cards)          multiSave('cards', data.cards);
      if (data.beneficiaries)  multiSave('beneficiaries', data.beneficiaries);
      if (data.tickets)        multiSave('tickets', data.tickets);
      if (data.approvals)      multiSave('approvals', data.approvals);
      return true;
    } catch(e) {
      console.error('Import failed', e);
      return false;
    }
  },
};

export default dataStore;
