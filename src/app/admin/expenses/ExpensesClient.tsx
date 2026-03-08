'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Trash2, Filter, ExternalLink, ArrowUpDown } from 'lucide-react';
import {
    useGetExpensesQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    Expense as AdminExpense
} from '@/lib/api/expensesApi';

const CATEGORIES = [
    'Marketing',
    'Equipment',
    'Permits & Licenses',
    'Insurance',
    'Maintenance',
    'Fuel',
    'Software',
    'Legal & Professional',
    'Other'
];

export default function ExpensesClient() {
    const { data: expenses, isLoading } = useGetExpensesQuery();
    const [addExpense] = useAddExpenseMutation();
    const [deleteExpense] = useDeleteExpenseMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Sorting
    const [sortField, setSortField] = useState<keyof AdminExpense>('expense_date');
    const [sortAsc, setSortAsc] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        expense_date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        category: CATEGORIES[0],
        link: ''
    });

    // Derived Data: Filtering and Sorting
    const processedExpenses = useMemo(() => {
        if (!expenses) return [];

        let filtered = expenses.filter(exp => {
            const matchesSearch =
                exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            // Handle nulls
            if (valA === null) valA = '';
            if (valB === null) valB = '';

            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [expenses, searchQuery, categoryFilter, sortField, sortAsc]);

    // Derived Data: Total
    const displayTotal = useMemo(() => {
        return processedExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    }, [processedExpenses]);

    const handleSort = (field: keyof AdminExpense) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(field === 'name' || field === 'category');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addExpense({
                name: formData.name,
                description: formData.description || '',
                expense_date: formData.expense_date,
                amount: parseFloat(formData.amount),
                category: formData.category,
                link: formData.link || ''
            }).unwrap();

            setIsAdding(false);
            setFormData({
                name: '',
                description: '',
                expense_date: format(new Date(), 'yyyy-MM-dd'),
                amount: '',
                category: CATEGORIES[0],
                link: ''
            });
        } catch (error) {
            console.error('Failed to add expense:', error);
            alert('Failed to add expense. Check console for details.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">Total Displayed</p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">
                        ${displayTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                        Based on {processedExpenses.length} filtered items
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add New Expense</>}
                    </button>
                </div>
            </div>

            {/* Add Expense Form (Dropdown) */}
            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-sky-200 dark:border-sky-900 border-t-4 border-t-sky-500">
                    <h3 className="text-lg font-bold mb-4">Record New Expense</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Date *</label>
                            <input type="date" required value={formData.expense_date} onChange={e => setFormData({ ...formData, expense_date: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Amount *</label>
                            <input type="number" step="0.01" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Item/Service Name *</label>
                            <input type="text" required placeholder="e.g. Meta Ads, Winch Rope" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Category *</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Description (Optional)</label>
                            <input type="text" placeholder="Additional details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Receipt/Invoice Link (Optional)</label>
                            <input type="url" placeholder="https://" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent text-sm" />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                                Save Expense
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search items or descriptions..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="py-2 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none min-w-[160px]"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('expense_date')}>
                                    <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="p-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-1">Item <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="p-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('category')}>
                                    <div className="flex items-center gap-1">Category <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="p-4 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => handleSort('amount')}>
                                    <div className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="p-4 text-center font-semibold">Link</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading expenses...</td>
                                </tr>
                            ) : processedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-500">
                                        No expenses found. Adjust filters or add a new one.
                                    </td>
                                </tr>
                            ) : (
                                processedExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-mono text-sm">{format(new Date(expense.expense_date), 'MMM d, yyyy')}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{expense.name}</div>
                                            {expense.description && <div className="text-xs text-slate-500 max-w-xs truncate">{expense.description}</div>}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-medium text-right text-slate-900 dark:text-white">
                                            ${Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-center">
                                            {expense.link ? (
                                                <a href={expense.link} target="_blank" rel="noopener noreferrer" className="inline-flex text-sky-500 hover:text-sky-600 bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg transition-colors" title="View Original Receipt">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete Expense"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
