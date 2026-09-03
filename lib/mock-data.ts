// Mock ledger seeded for INR en-IN — real Supabase will mirror this in supabase/seed.sql
export interface Transaction {
  id: string;
  date: string;
  payee: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  flagged?: boolean;
}

export const MOCK_BALANCE = 485720.5; // ₹4,85,720.50 in lakh grouping

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "txn_001", date: "2026-08-28", payee: "Asha Medical Store", amount: 1250, type: "debit", category: "Healthcare" },
  { id: "txn_002", date: "2026-08-26", payee: "Maa Kirana", amount: 2450, type: "debit", category: "Groceries" },
  { id: "txn_003", date: "2026-08-25", payee: "Pension Credit", amount: 32000, type: "credit", category: "Income" },
  { id: "txn_004", date: "2026-08-22", payee: "BSNL Broadband", amount: 999, type: "debit", category: "Utilities" },
  { id: "txn_005", date: "2026-08-20", payee: "Sunita Devi (Daughter)", amount: 5000, type: "debit", category: "Family" },
  { id: "txn_006", date: "2026-08-18", payee: "Apollo Pharmacy", amount: 875, type: "debit", category: "Healthcare" },
  { id: "txn_007", date: "2026-08-15", payee: "LIC Premium", amount: 4500, type: "debit", category: "Insurance" },
  { id: "txn_008", date: "2026-08-12", payee: "Big Bazaar", amount: 3120, type: "debit", category: "Groceries" },
  { id: "txn_009", date: "2026-08-10", payee: "Interest Credit", amount: 1245.5, type: "credit", category: "Income" },
  { id: "txn_010", date: "2026-08-08", payee: "Electricity Board", amount: 2100, type: "debit", category: "Utilities" },
  { id: "txn_011", date: "2026-08-05", payee: "SBI ATM Withdrawal", amount: 10000, type: "debit", category: "Cash" },
  { id: "txn_012", date: "2026-08-03", payee: "Reliance Digital", amount: 18999, type: "debit", category: "Electronics" },
  { id: "txn_013", date: "2026-08-01", payee: "Pension Credit", amount: 32000, type: "credit", category: "Income" },
  { id: "txn_014", date: "2026-07-29", payee: "Dr. Sharma Clinic", amount: 1500, type: "debit", category: "Healthcare" },
  { id: "txn_015", date: "2026-07-27", payee: "Unknown Overseas Tx - HOLD", amount: 45000, type: "debit", category: "Flagged", flagged: true },
  { id: "txn_016", date: "2026-07-25", payee: "Muthoot Finance", amount: 7500, type: "debit", category: "Loan" },
  { id: "txn_017", date: "2026-07-22", payee: "UPI Autopay - Rent", amount: 15000, type: "debit", category: "Housing" },
  { id: "txn_018", date: "2026-07-20", payee: "Gift Card Purchase - Unknown", amount: 25000, type: "debit", category: "Flagged", flagged: true },
  { id: "txn_019", date: "2026-07-18", payee: "Indian Oil", amount: 2800, type: "debit", category: "Fuel" },
  { id: "txn_020", date: "2026-07-15", payee: "Emergency Bail Transfer", amount: 50000, type: "debit", category: "Flagged", flagged: true },
];

export const FRAUD_SCENARIOS = [
  { query: "Transfer ₹50,000 to unknown account for emergency bail", amount: 50000, payee: "unknown_bail", risk: 96 },
  { query: "Buy ₹25,000 gift card urgently for stranger", amount: 25000, payee: "gift_card", risk: 94 },
  { query: "Wire ₹45,000 to overseas unknown account", amount: 45000, payee: "overseas", risk: 92 },
  { query: "Transfer ₹5,000 to Sunita Devi", amount: 5000, payee: "Sunita Devi", risk: 8 },
] as const;
