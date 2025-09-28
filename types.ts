export type ExpenseCategory = 'سكن' | 'فواتير' | 'طعام' | 'مواصلات' | 'صحة' | 'ترفيه' | 'ديون' | 'أخرى';

export const categories: ExpenseCategory[] = ['سكن', 'فواتير', 'طعام', 'مواصلات', 'صحة', 'ترفيه', 'ديون', 'أخرى'];

export interface Expense {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  receiptImage: string | null; // Store image as base64 string
  category: ExpenseCategory;
  expectedAmount?: number;
}

export interface MonthData {
    salary: number;
    expenses: Expense[];
}
