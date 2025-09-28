import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Expense, ExpenseCategory, categories, MonthData } from './types';

// --- SVG Icons ---
const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ReceiptTaxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2-2 4 4 4-4-2-2m-2-2l-2-2-4 4-4-4 2 2m2 2l2 2 4-4 4 4-2 2m-2 2l-2 2-4-4-4 4 2 2" />
  </svg>
);

const ReceiptIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0113.53-7.94M20 20a14.95 14.95 0 01-13.53 7.94" />
    </svg>
);


// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' }).format(amount);
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('ar-JO', { month: 'long', year: 'numeric' });
};


// --- Components ---

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: string; onClick?: () => void; }> = ({ title, amount, icon, color, onClick }) => (
    <div 
        className={`bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 space-x-reverse ${onClick ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''}`}
        onClick={onClick}
    >
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-white text-2xl font-bold">{formatCurrency(amount)}</p>
        </div>
    </div>
);

const MonthSelector: React.FC<{ currentMonth: string; onMonthChange: (newMonth: string) => void; onNewMonth: () => void; hasNextMonth: boolean; }> = ({ currentMonth, onMonthChange, onNewMonth, hasNextMonth }) => {
    const changeMonth = (offset: number) => {
        const [year, month] = currentMonth.split('-').map(Number);
        const newDate = new Date(year, month - 1 + offset, 1);
        onMonthChange(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    };

    return (
        <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg my-4">
            <button onClick={() => changeMonth(1)} disabled={hasNextMonth} className="p-2 text-white bg-teal-600 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-teal-500 transition-colors">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
            <div className="text-center">
                 <p className="text-white text-lg font-bold">{getMonthName(currentMonth)}</p>
                 <button onClick={onNewMonth} className="text-sm text-teal-400 hover:text-teal-300">
                    بدء شهر جديد
                 </button>
            </div>
            <button onClick={() => changeMonth(-1)} className="p-2 text-white bg-teal-600 rounded-full hover:bg-teal-500 transition-colors">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
        </div>
    );
};


const ExpenseFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Omit<Expense, 'id' | 'paidAmount'>, id?: string) => void;
    expenseToEdit?: Expense | null;
}> = ({ isOpen, onClose, onSave, expenseToEdit }) => {
    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [expectedAmount, setExpectedAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('أخرى');
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (expenseToEdit) {
            setName(expenseToEdit.name);
            setTotalAmount(String(expenseToEdit.totalAmount));
            setExpectedAmount(String(expenseToEdit.expectedAmount || ''));
            setCategory(expenseToEdit.category);
            setReceiptImage(expenseToEdit.receiptImage);
        } else {
            setName('');
            setTotalAmount('');
            setExpectedAmount('');
            setCategory('أخرى');
            setReceiptImage(null);
        }
    }, [expenseToEdit, isOpen]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64 = await blobToBase64(e.target.files[0]);
                setReceiptImage(base64);
            } catch (error) {
                console.error("Error converting file to base64", error);
                alert("حدث خطأ أثناء تحميل الصورة.");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const total = parseFloat(totalAmount);
        if (!name || isNaN(total) || total <= 0) {
            alert("يرجى إدخال اسم وقيمة صحيحة للالتزام.");
            return;
        }
        
        const expected = expectedAmount ? parseFloat(expectedAmount) : undefined;

        onSave({
            name,
            totalAmount: total,
            category,
            receiptImage,
            expectedAmount: expected
        }, expenseToEdit?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">{expenseToEdit ? 'تعديل الالتزام' : 'إضافة التزام جديد'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input type="text" placeholder="اسم الالتزام" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                        <input type="number" placeholder="المبلغ الإجمالي" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                        <input type="number" placeholder="المبلغ المتوقع (اختياري)" value={expectedAmount} onChange={e => setExpectedAmount(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <div>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-gray-600 text-white p-3 rounded-md hover:bg-gray-500 transition-colors">
                                <CameraIcon className="w-5 h-5"/>
                                <span>{receiptImage ? 'تغيير الإيصال' : 'إضافة إيصال'}</span>
                            </button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            {receiptImage && (
                                <div className="mt-2 text-center">
                                    <img src={receiptImage} alt="Preview" className="max-h-32 mx-auto rounded-md" />
                                    <button type="button" onClick={() => setReceiptImage(null)} className="text-red-400 text-sm mt-1 hover:text-red-300">إزالة الصورة</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAddPayment: (amount: number, receiptImage: string | null) => void;
    expense: Expense | null;
}> = ({ isOpen, onClose, onAddPayment, expense }) => {
    const [amount, setAmount] = useState('');
    const [receiptImage, setReceiptImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setReceiptImage(null);
        }
    }, [isOpen]);

    if (!isOpen || !expense) return null;

    const remaining = expense.totalAmount - expense.paidAmount;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64 = await blobToBase64(e.target.files[0]);
                setReceiptImage(base64);
            } catch (error) {
                console.error("Error converting file to base64", error);
                alert("حدث خطأ أثناء تحميل الصورة.");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const paymentAmount = parseFloat(amount);
        if (isNaN(paymentAmount) || paymentAmount <= 0) {
            alert("يرجى إدخال مبلغ صحيح.");
            return;
        }
        if (paymentAmount > remaining) {
            if (!confirm(`المبلغ المدخل أكبر من المتبقي. هل تريد الاستمرار؟`)) {
                return;
            }
        }
        onAddPayment(paymentAmount, receiptImage);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-2">إضافة دفعة لـ "{expense.name}"</h2>
                <p className="text-gray-400 mb-4">المبلغ المتبقي: {formatCurrency(remaining)}</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="number"
                            placeholder="أدخل مبلغ الدفعة"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                            autoFocus
                        />
                         {expense.receiptImage ? (
                             <div className="text-center bg-gray-700 p-3 rounded-md">
                                <p className="text-gray-300 text-sm">يوجد إيصال مسبقاً. لتعديله، يرجى تحرير الالتزام نفسه.</p>
                             </div>
                        ) : (
                            <div>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-gray-600 text-white p-3 rounded-md hover:bg-gray-500 transition-colors">
                                    <CameraIcon className="w-5 h-5"/>
                                    <span>{receiptImage ? 'تغيير الإيصال' : 'إضافة إيصال'}</span>
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                {receiptImage && (
                                    <div className="mt-2 text-center">
                                        <img src={receiptImage} alt="Preview" className="max-h-32 mx-auto rounded-md" />
                                        <button type="button" onClick={() => setReceiptImage(null)} className="text-red-400 text-sm mt-1 hover:text-red-300">إزالة الصورة</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">إضافة الدفعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ViewReceiptModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    receiptImage: string | null;
}> = ({ isOpen, onClose, receiptImage }) => {
    if (!isOpen || !receiptImage) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-4 shadow-xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-white bg-gray-700 rounded-full p-1">
                    <XIcon className="w-5 h-5"/>
                </button>
                <img src={receiptImage} alt="Receipt" className="max-w-full max-h-[80vh] rounded-md" />
            </div>
        </div>
    );
};

const CategorySummary: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
    const summary = useMemo(() => {
        const result: { [key in ExpenseCategory]?: { total: number, paid: number } } = {};
        for (const expense of expenses) {
            if (!result[expense.category]) {
                result[expense.category] = { total: 0, paid: 0 };
            }
            result[expense.category]!.total += expense.totalAmount;
            result[expense.category]!.paid += expense.paidAmount;
        }
        return result;
    }, [expenses]);

    return (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FIX: Type cast to fix `data` being inferred as `unknown` by `Object.entries`. */}
            {(Object.entries(summary) as [string, { total: number; paid: number }][]).map(([category, data]) => (
                <div key={category} className="bg-gray-700 p-3 rounded-md">
                    <h4 className="font-bold text-white">{category}</h4>
                    <p className="text-sm text-gray-300">الإجمالي: {formatCurrency(data.total)}</p>
                    <p className="text-sm text-teal-400">المدفوع: {formatCurrency(data.paid)}</p>
                </div>
            ))}
        </div>
    );
};

const ReportModal: React.FC<{
    isOpen: boolean;
    onClose: (options: { carryOverUnpaid: boolean; recurringIds: string[] }) => void;
    monthData: MonthData | null;
    monthKey: string;
}> = ({ isOpen, onClose, monthData, monthKey }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [selectedRecurringIds, setSelectedRecurringIds] = useState<Set<string>>(new Set());
    const [shouldCarryOverUnpaid, setShouldCarryOverUnpaid] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedRecurringIds(new Set());
            setShouldCarryOverUnpaid(false);
        }
    }, [isOpen]);

    if (!isOpen || !monthData) return null;

    const handleToggleRecurring = (id: string) => {
        setSelectedRecurringIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const handleConfirm = () => {
        onClose({
            carryOverUnpaid: shouldCarryOverUnpaid,
            recurringIds: Array.from(selectedRecurringIds)
        });
    };

    const unpaidExpenses = monthData.expenses.filter(e => e.paidAmount < e.totalAmount);
    const totalPaid = monthData.expenses.reduce((sum, e) => sum + e.paidAmount, 0);
    const totalCommitments = monthData.expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const remainingBalance = monthData.salary - totalPaid;

    const handleDownload = () => {
        if (reportRef.current && (window as any).html2canvas) {
            (window as any).html2canvas(reportRef.current, { backgroundColor: '#1f2937' }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = `report-${monthKey}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div ref={reportRef} className="p-6">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">تقرير {getMonthName(monthKey)}</h2>
                    <div className="grid grid-cols-2 gap-4 my-6 text-center">
                        <div className="bg-gray-900 p-4 rounded-lg"><p className="text-gray-400">الراتب</p><p className="text-white text-xl">{formatCurrency(monthData.salary)}</p></div>
                        <div className="bg-gray-900 p-4 rounded-lg"><p className="text-gray-400">إجمالي المصاريف</p><p className="text-red-400 text-xl">{formatCurrency(totalPaid)}</p></div>
                        <div className="bg-gray-900 p-4 rounded-lg"><p className="text-gray-400">إجمالي الالتزامات</p><p className="text-yellow-400 text-xl">{formatCurrency(totalCommitments)}</p></div>
                        <div className="bg-gray-900 p-4 rounded-lg"><p className="text-gray-400">المبلغ المتبقي</p><p className="text-green-400 text-xl">{formatCurrency(remainingBalance)}</p></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2">ملخص حسب الفئة</h3>
                    <CategorySummary expenses={monthData.expenses} />
                </div>
                <div className="px-6 pt-2 pb-4">
                    <h3 className="text-xl font-bold text-white mt-6 mb-4 border-b border-gray-700 pb-2">
                        تكرار الالتزامات للشهر الجديد
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 mb-4">
                        {monthData.expenses.length > 0 ? monthData.expenses.map(expense => (
                            <label key={expense.id} className="flex items-center bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-600">
                                <input
                                    type="checkbox"
                                    checked={selectedRecurringIds.has(expense.id)}
                                    onChange={() => handleToggleRecurring(expense.id)}
                                    className="form-checkbox h-5 w-5 text-teal-600 bg-gray-800 border-gray-600 rounded focus:ring-teal-500"
                                />
                                <span className="mr-3 text-white">{expense.name}</span>
                                <span className="mr-auto text-gray-400">{formatCurrency(expense.totalAmount)}</span>
                            </label>
                        )) : <p className="text-gray-500 text-center">لا توجد التزامات للاختيار.</p>}
                    </div>
                </div>

                 <div className="px-6 py-4 bg-gray-900/50">
                    {unpaidExpenses.length > 0 && (
                        <div className="mb-4">
                             <label className="flex items-center text-yellow-300 cursor-pointer p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={shouldCarryOverUnpaid}
                                    onChange={(e) => setShouldCarryOverUnpaid(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-yellow-500 bg-gray-800 border-yellow-700 rounded focus:ring-yellow-400"
                                />
                                <span className="mr-3 text-sm">
                                    ترحيل الأرصدة غير المدفوعة ({unpaidExpenses.length} التزام) للشهر الجديد
                                </span>
                            </label>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                         <button onClick={handleDownload} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
                            <DownloadIcon className="w-5 h-5"/>
                            <span>تحميل التقرير</span>
                        </button>
                        <div className="flex w-full sm:w-auto gap-3">
                            <button onClick={() => onClose({ carryOverUnpaid: false, recurringIds: [] })} className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
                                إغلاق فقط
                            </button>
                            <button onClick={handleConfirm} className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">
                                بدء الشهر الجديد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ExpenseItem: React.FC<{
    expense: Expense;
    onDelete: (id: string) => void;
    onEdit: (expense: Expense) => void;
    onAddPayment: (expense: Expense) => void;
    onViewReceipt: (image: string) => void;
    onResetPayments: (id: string) => void;
}> = ({ expense, onDelete, onEdit, onAddPayment, onViewReceipt, onResetPayments }) => {
    const paidPercentage = expense.totalAmount > 0 ? (expense.paidAmount / expense.totalAmount) * 100 : 0;
    const isPaid = expense.paidAmount >= expense.totalAmount;
    
    return (
        <div className={`bg-gray-800 p-4 rounded-lg shadow-md border-l-4 ${isPaid ? 'border-green-500' : 'border-teal-500'} transition-all`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-white">{expense.name}</h3>
                    <p className="text-sm text-gray-400">{expense.category}</p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    {expense.receiptImage && (
                        <button onClick={() => onViewReceipt(expense.receiptImage!)} className="p-2 text-gray-400 hover:text-white transition-colors"><ReceiptIcon className="w-5 h-5" /></button>
                    )}
                    <button onClick={() => onEdit(expense)} className="p-2 text-gray-400 hover:text-white transition-colors"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={() => onDelete(expense.id)} className="p-2 text-red-500 hover:text-red-400 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="my-3">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>{formatCurrency(expense.paidAmount)}</span>
                    <span>{formatCurrency(expense.totalAmount)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(paidPercentage, 100)}%` }}></div>
                </div>
                {expense.expectedAmount && <p className="text-xs text-gray-500 mt-1">المبلغ المتوقع: {formatCurrency(expense.expectedAmount)}</p>}
            </div>

            <div className="flex space-x-2 space-x-reverse">
                {!isPaid && (
                    <button onClick={() => onAddPayment(expense)} className="flex-1 bg-teal-600 text-white px-3 py-2 text-sm rounded-md hover:bg-teal-500 transition-colors">
                        إضافة دفعة
                    </button>
                )}
                 {expense.paidAmount > 0 && (
                    <button onClick={() => onResetPayments(expense.id)} className="flex-1 bg-gray-600 text-white px-3 py-2 text-sm rounded-md hover:bg-gray-500 transition-colors">
                       إلغاء الدفعات
                    </button>
                )}
            </div>
        </div>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    const [allData, setAllData] = useState<Record<string, MonthData>>({});
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());
    
    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [expenseForPayment, setExpenseForPayment] = useState<Expense | null>(null);
    const [receiptToView, setReceiptToView] = useState<string | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportData, setReportData] = useState<{key: string, data: MonthData} | null>(null);
    
    // Salary editing state
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [salaryInput, setSalaryInput] = useState('');

    // Load data from localStorage on initial render
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('salaryManagerData');
            if (savedData) {
                setAllData(JSON.parse(savedData));
            } else {
                 setAllData({ [currentMonth]: { salary: 0, expenses: [] } });
            }
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setAllData({ [currentMonth]: { salary: 0, expenses: [] } });
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if(Object.keys(allData).length > 0) {
            localStorage.setItem('salaryManagerData', JSON.stringify(allData));
        }
    }, [allData]);
    
    // Ensure current month has data
    useEffect(() => {
        if (!allData[currentMonth]) {
            setAllData(prev => ({ ...prev, [currentMonth]: { salary: 0, expenses: [] }}));
        }
    }, [currentMonth, allData]);

    const currentMonthData = useMemo(() => allData[currentMonth] || { salary: 0, expenses: [] }, [allData, currentMonth]);

    const handleEditSalaryClick = () => {
        setSalaryInput(String(currentMonthData.salary || ''));
        setIsEditingSalary(true);
    };

    const handleConfirmSalary = () => {
        const newSalary = parseFloat(salaryInput);
        if (!isNaN(newSalary) && newSalary >= 0) {
            setAllData(prev => ({...prev, [currentMonth]: { ...currentMonthData, salary: newSalary }}));
            setIsEditingSalary(false);
        } else {
            alert("الرجاء إدخال رقم صحيح.");
        }
    };

    const handleCancelSalaryEdit = () => {
        setIsEditingSalary(false);
    };
    
    const handleSaveExpense = (newExpenseData: Omit<Expense, 'id' | 'paidAmount'>, id?: string) => {
        const newExpenses = [...currentMonthData.expenses];
        if (id) { // Editing existing expense
            const index = newExpenses.findIndex(e => e.id === id);
            if (index !== -1) {
                newExpenses[index] = { ...newExpenses[index], ...newExpenseData };
            }
        } else { // Adding new expense
            const newExpense: Expense = {
                ...newExpenseData,
                id: Date.now().toString(),
                paidAmount: 0,
            };
            newExpenses.push(newExpense);
        }
        setAllData(prev => ({...prev, [currentMonth]: { ...currentMonthData, expenses: newExpenses }}));
    };

    const handleDeleteExpense = (id: string) => {
        if (confirm("هل أنت متأكد من حذف هذا الالتزام؟")) {
            const updatedExpenses = currentMonthData.expenses.filter(e => e.id !== id);
            setAllData(prev => ({...prev, [currentMonth]: { ...currentMonthData, expenses: updatedExpenses }}));
        }
    };

    const handleAddPayment = (amount: number, newReceiptImage: string | null) => {
        if (!expenseForPayment) return;
        const updatedExpenses = currentMonthData.expenses.map(exp => {
            if (exp.id === expenseForPayment.id) {
                const newPaidAmount = exp.paidAmount + amount;
                const finalReceiptImage = newReceiptImage || exp.receiptImage;
                return { ...exp, paidAmount: newPaidAmount, receiptImage: finalReceiptImage };
            }
            return exp;
        });
        setAllData(prev => ({...prev, [currentMonth]: { ...currentMonthData, expenses: updatedExpenses }}));
    };

    const handleResetPayments = (id: string) => {
        if (confirm("هل أنت متأكد من إلغاء جميع الدفعات لهذا الالتزام؟")) {
            const updatedExpenses = currentMonthData.expenses.map(exp => 
                exp.id === id ? { ...exp, paidAmount: 0 } : exp
            );
            setAllData(prev => ({...prev, [currentMonth]: { ...currentMonthData, expenses: updatedExpenses }}));
        }
    };
    
    const handleStartNewMonth = () => {
        const nextMonthKey = (() => {
            const [year, month] = currentMonth.split('-').map(Number);
            const nextDate = new Date(year, month, 1);
            return `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;
        })();

        setReportData({ key: currentMonth, data: currentMonthData });
        setIsReportOpen(true);
        setCurrentMonth(nextMonthKey);
    };

    const handleCloseReport = (options: { recurringIds: string[], carryOverUnpaid: boolean }) => {
        const previousMonthData = reportData?.data;
        if (!previousMonthData) {
            setIsReportOpen(false);
            setReportData(null);
            return;
        }

        const newExpensesForNextMonth: Expense[] = [];

        // Handle recurring expenses
        if (options.recurringIds.length > 0) {
            const recurringExpenses = previousMonthData.expenses
                .filter(e => options.recurringIds.includes(e.id))
                .map(e => ({
                    ...e,
                    id: `recur-${Date.now()}-${e.id}`, // new unique ID
                    paidAmount: 0,
                    receiptImage: null, // Reset receipt for the new month
                }));
            newExpensesForNextMonth.push(...recurringExpenses);
        }
        
        // Handle unpaid balances
        if (options.carryOverUnpaid) {
            const unpaidExpenses = previousMonthData.expenses
                .filter(e => e.paidAmount < e.totalAmount)
                .map(e => ({
                    ...e,
                    name: `رصيد متبقي: ${e.name}`,
                    totalAmount: e.totalAmount - e.paidAmount,
                    paidAmount: 0,
                    id: `unpaid-${Date.now()}-${e.id}`, // new unique ID
                    receiptImage: null,
                }));
            newExpensesForNextMonth.push(...unpaidExpenses);
        }

        if (newExpensesForNextMonth.length > 0) {
            setAllData(prev => {
                const nextMonthData = prev[currentMonth] || { salary: 0, expenses: [] };
                return {
                    ...prev,
                    [currentMonth]: {
                        ...nextMonthData,
                        expenses: [...nextMonthData.expenses, ...newExpensesForNextMonth]
                    }
                };
            });
        }

        setIsReportOpen(false);
        setReportData(null);
    };

    const openEditModal = (expense: Expense) => {
        setExpenseToEdit(expense);
        setIsFormOpen(true);
    };

    const openAddModal = () => {
        setExpenseToEdit(null);
        setIsFormOpen(true);
    };

    const openPaymentModal = (expense: Expense) => {
        setExpenseForPayment(expense);
        setIsPaymentModalOpen(true);
    };

    const handleViewReceipt = (image: string) => {
        setReceiptToView(image);
    };

    const totalPaid = useMemo(() => currentMonthData.expenses.reduce((sum, exp) => sum + exp.paidAmount, 0), [currentMonthData.expenses]);
    const totalCommitments = useMemo(() => currentMonthData.expenses.reduce((sum, exp) => sum + exp.totalAmount, 0), [currentMonthData.expenses]);
    const remainingBalance = useMemo(() => currentMonthData.salary - totalPaid, [currentMonthData.salary, totalPaid]);

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="container mx-auto p-4 max-w-4xl">
                <header className="text-center my-6">
                    <h1 className="text-4xl font-bold text-teal-400">مدير الراتب</h1>
                    <p className="text-gray-400">تتبع وإدارة مصاريفك الشهرية بكل سهولة</p>
                </header>

                <MonthSelector 
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                    onNewMonth={handleStartNewMonth}
                    hasNextMonth={currentMonth === getCurrentMonthKey()}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                   <div className="md:col-span-1">
                        <SummaryCard title="الراتب" amount={currentMonthData.salary} icon={<WalletIcon className="w-8 h-8" />} color="bg-blue-500" onClick={handleEditSalaryClick}/>
                    </div>
                    <SummaryCard title="المصاريف" amount={totalPaid} icon={<ReceiptTaxIcon className="w-8 h-8" />} color="bg-red-500" />
                    <SummaryCard title="المتبقي" amount={remainingBalance} icon={<WalletIcon className="w-8 h-8" />} color="bg-green-500" />
                </div>
                
                 {isEditingSalary && (
                    <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-center gap-3">
                        <input
                            type="number"
                            value={salaryInput}
                            onChange={(e) => setSalaryInput(e.target.value)}
                            className="w-full sm:flex-1 bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="أدخل الراتب الجديد"
                            autoFocus
                        />
                        <div className="flex w-full sm:w-auto gap-2">
                             <button onClick={handleConfirmSalary} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">تأكيد</button>
                            <button onClick={handleCancelSalaryEdit} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">إلغاء</button>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">الالتزامات ({currentMonthData.expenses.length})</h2>
                    <button onClick={openAddModal} className="flex items-center space-x-2 space-x-reverse bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-500 transition-colors">
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentMonthData.expenses.length > 0 ? (
                        currentMonthData.expenses
                            .sort((a,b) => (a.paidAmount >= a.totalAmount ? 1 : -1) - (b.paidAmount >= b.totalAmount ? 1 : -1) || a.name.localeCompare(b.name))
                            .map(expense => (
                                <ExpenseItem 
                                    key={expense.id}
                                    expense={expense}
                                    onDelete={handleDeleteExpense}
                                    onEdit={openEditModal}
                                    onAddPayment={openPaymentModal}
                                    onViewReceipt={handleViewReceipt}
                                    onResetPayments={handleResetPayments}
                                />
                            ))
                        ) : (
                        <p className="text-gray-500 md:col-span-2 text-center py-8">لا توجد التزامات بعد. ابدأ بإضافة التزام جديد!</p>
                    )}
                </div>

                {/* Modals */}
                <ExpenseFormModal 
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveExpense}
                    expenseToEdit={expenseToEdit}
                />
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onAddPayment={handleAddPayment}
                    expense={expenseForPayment}
                />
                <ViewReceiptModal
                    isOpen={!!receiptToView}
                    onClose={() => setReceiptToView(null)}
                    receiptImage={receiptToView}
                />
                 {reportData && <ReportModal 
                    isOpen={isReportOpen}
                    onClose={handleCloseReport}
                    monthData={reportData.data}
                    monthKey={reportData.key}
                />}

            </div>
        </div>
    );
};

export default App;
