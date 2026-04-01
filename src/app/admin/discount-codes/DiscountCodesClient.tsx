'use client';

import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X, Tag } from 'lucide-react';
import {
    useGetDiscountCodesQuery,
    useAddDiscountCodeMutation,
    useUpdateDiscountCodeMutation,
    useDeleteDiscountCodeMutation,
} from '@/lib/api/discountCodesApi';

export default function DiscountCodesClient() {
    const { data: codes, isLoading } = useGetDiscountCodesQuery();
    const [addDiscountCode] = useAddDiscountCodeMutation();
    const [updateDiscountCode] = useUpdateDiscountCodeMutation();
    const [deleteDiscountCode] = useDeleteDiscountCodeMutation();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ code_name: '', amount: '' });
    const [editData, setEditData] = useState({ code_name: '', amount: '' });

    const activeCount = codes ? codes.filter((c) => c.is_active).length : 0;

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDiscountCode({
                code_name: formData.code_name.trim().toUpperCase(),
                amount: parseFloat(formData.amount),
            }).unwrap();
            setIsAdding(false);
            setFormData({ code_name: '', amount: '' });
        } catch (error) {
            console.error('Failed to add discount code:', error);
            alert('Failed to add discount code. Check console for details.');
        }
    };

    const handleEdit = (id: string, code_name: string, amount: number) => {
        setEditingId(id);
        setEditData({ code_name, amount: String(amount) });
    };

    const handleEditSave = async (id: string) => {
        try {
            await updateDiscountCode({
                id,
                code_name: editData.code_name.trim().toUpperCase(),
                amount: parseFloat(editData.amount),
            }).unwrap();
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update discount code:', error);
            alert('Failed to update discount code. Check console for details.');
        }
    };

    const handleToggleActive = async (id: string, currentActive: boolean) => {
        try {
            await updateDiscountCode({ id, is_active: !currentActive }).unwrap();
        } catch (error) {
            console.error('Failed to toggle discount code status:', error);
        }
    };

    const handleDelete = async (id: string, code_name: string) => {
        if (confirm(`Delete code ${code_name}?`)) {
            try {
                await deleteDiscountCode(id).unwrap();
            } catch (error) {
                console.error('Failed to delete discount code:', error);
                alert('Failed to delete discount code. Check console for details.');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Summary Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                        <Tag className="w-5 h-5 text-sky-500" />
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Codes</p>
                    </div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
                    <p className="text-sm text-slate-400 mt-2">
                        {codes ? `${codes.length} total code${codes.length !== 1 ? 's' : ''}` : 'Loading...'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {isAdding ? (
                            <>
                                <X className="w-5 h-5" /> Cancel
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" /> Add New Code
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-sky-200 dark:border-sky-900 border-t-4 border-t-sky-500">
                    <h3 className="text-lg font-bold mb-4">Create New Discount Code</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Code Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="SUMMER20"
                                value={formData.code_name}
                                onChange={(e) => setFormData({ ...formData, code_name: e.target.value })}
                                className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent font-mono uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Discount Amount ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                placeholder="25.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-transparent"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                            >
                                Create Code
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Codes Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Code Name</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        Loading discount codes...
                                    </td>
                                </tr>
                            ) : !codes || codes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        No discount codes yet. Create your first code above.
                                    </td>
                                </tr>
                            ) : (
                                codes.map((code) => (
                                    <tr
                                        key={code.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        {/* Code Name */}
                                        <td className="p-4">
                                            {editingId === code.id ? (
                                                <input
                                                    type="text"
                                                    value={editData.code_name}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, code_name: e.target.value })
                                                    }
                                                    className="p-1 rounded border border-slate-300 dark:border-slate-600 bg-transparent font-mono uppercase text-sm w-36"
                                                />
                                            ) : (
                                                <span className="font-mono font-semibold uppercase text-slate-900 dark:text-white">
                                                    {code.code_name}
                                                </span>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="p-4">
                                            {editingId === code.id ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={editData.amount}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, amount: e.target.value })
                                                    }
                                                    className="p-1 rounded border border-slate-300 dark:border-slate-600 bg-transparent text-sm w-24"
                                                />
                                            ) : (
                                                <span className="font-mono text-slate-900 dark:text-white">
                                                    ${Number(code.amount).toFixed(2)}
                                                </span>
                                            )}
                                        </td>

                                        {/* Status badge — click to toggle */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleActive(code.id, code.is_active)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                                    code.is_active
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                }`}
                                                title={code.is_active ? 'Click to deactivate' : 'Click to activate'}
                                            >
                                                {code.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 text-right">
                                            {editingId === code.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditSave(code.id)}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                                        title="Save"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(code.id, code.code_name, code.amount)
                                                        }
                                                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(code.id, code.code_name)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
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
