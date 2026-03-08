'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Package, Search, Tag, FileText } from 'lucide-react';
import {
    useGetSuppliesQuery,
    useAddSupplyMutation,
    useDeleteSupplyMutation,
    AdminSupply,
} from '@/lib/api/suppliesApi';

const CATEGORIES = [
    'Safety Gear',
    'Boat Equipment',
    'Cleaning Supplies',
    'Office / Admin',
    'First Aid',
    'Merchandise',
    'Tools',
    'Other',
];

interface SuppliesModalProps {
    onClose: () => void;
}

export default function SuppliesModal({ onClose }: SuppliesModalProps) {
    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [reason, setReason] = useState('');
    const [formError, setFormError] = useState('');

    // Filter state
    const [filterCategory, setFilterCategory] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    // RTK Query
    const { data: supplies = [], isLoading } = useGetSuppliesQuery({
        category: filterCategory || undefined,
        search: filterSearch || undefined,
    });
    const [addSupply, { isLoading: isAdding }] = useAddSupplyMutation();
    const [deleteSupply] = useDeleteSupplyMutation();

    // Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim() || !category.trim() || !reason.trim()) {
            setFormError('All three fields are required.');
            return;
        }

        try {
            await addSupply({ name: name.trim(), category: category.trim(), reason: reason.trim() }).unwrap();
            setName('');
            setCategory('');
            setReason('');
        } catch {
            setFormError('Failed to add supply. Please try again.');
        }
    };

    const handleDelete = async (supply: AdminSupply) => {
        if (!confirm(`Delete "${supply.name}"?`)) return;
        try {
            await deleteSupply(supply.id).unwrap();
        } catch {
            console.error('Failed to delete supply');
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-700 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-md">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Supplies List</h2>
                            <p className="text-xs text-slate-500">Track items you need to purchase or restock</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Add Form */}
                    <section>
                        <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Add Supply</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Name */}
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Supply name *"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm"
                                />
                            </div>

                            {/* Category */}
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm appearance-none"
                                >
                                    <option value="">Select category *</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Reason */}
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason / notes *"
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm resize-none"
                            />

                            {formError && (
                                <p className="text-red-500 text-xs font-medium">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isAdding}
                                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition shadow-md text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                {isAdding ? 'Adding...' : 'Add Supply'}
                            </button>
                        </form>
                    </section>

                    {/* Filters */}
                    <section>
                        <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">Filter</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                    placeholder="Search name or reason..."
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm"
                                />
                            </div>

                            {/* Category filter */}
                            <div className="relative sm:w-52">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm appearance-none"
                                >
                                    <option value="">All categories</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* List */}
                    <section>
                        <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
                            Supplies
                            {supplies.length > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-600/10 text-sky-600 text-xs font-bold">
                                    {supplies.length}
                                </span>
                            )}
                        </h3>

                        {isLoading ? (
                            <div className="text-center py-8 text-sky-600 text-sm">Loading supplies...</div>
                        ) : supplies.length === 0 ? (
                            <div className="text-center py-10 rounded-xl border border-dashed border-sky-200 dark:border-slate-700 text-slate-400 text-sm">
                                No supplies found. Add one above!
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {supplies.map((supply) => (
                                    <li
                                        key={supply.id}
                                        className="flex items-start gap-3 p-3 rounded-xl border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 group hover:border-sky-600 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                                    {supply.name}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-600/10 text-sky-600 text-xs font-medium whitespace-nowrap">
                                                    {supply.category}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">
                                                {supply.reason}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(supply)}
                                            title="Delete supply"
                                            className="flex-shrink-0 p-1.5 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
