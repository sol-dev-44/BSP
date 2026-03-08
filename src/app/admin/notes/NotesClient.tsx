'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

type Note = {
    id: string;
    created_at: string;
    content: string;
    category: string;
    is_pinned: boolean;
};

const DEFAULT_CATEGORIES = ['General', 'Incident', 'Customer Service', 'Maintenance', 'Other'];

export default function NotesClient() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // New Note State
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState<string>('General');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/notes');
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            setNotes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent.trim() || !newCategory.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent, category: newCategory }),
            });

            if (!res.ok) throw new Error('Failed to create note');

            setNewContent('');
            setNewCategory('General');
            await fetchNotes();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePin = async (id: string, currentPinStatus: boolean) => {
        try {
            // Optimistic update
            setNotes(prev => {
                const updated = prev.map(n => n.id === id ? { ...n, is_pinned: !currentPinStatus } : n);
                return updated.sort((a, b) => {
                    if (a.is_pinned === b.is_pinned) {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                    return a.is_pinned ? -1 : 1;
                });
            });

            const res = await fetch('/api/notes', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_pinned: !currentPinStatus }),
            });

            if (!res.ok) throw new Error('Failed to update pin status');
        } catch (err: any) {
            setError('Failed to update pin status. Please refresh.');
            fetchNotes();
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            // Optimistic update
            setNotes(prev => prev.filter(n => n.id !== id));

            const res = await fetch(`/api/notes?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete note');
        } catch (err: any) {
            setError('Failed to delete note. Please refresh.');
            fetchNotes();
        }
    };

    // Calculate dynamic categories based on existing notes + defaults
    const uniqueCategories = useMemo(() => {
        const catSet = new Set(DEFAULT_CATEGORIES);
        notes.forEach(n => {
            if (n.category) catSet.add(n.category);
        });
        return Array.from(catSet).sort();
    }, [notes]);

    // Derived filtered notes based on category and fuzzy search
    const filteredNotes = useMemo(() => {
        return notes.filter(n => {
            const matchesCategory = filterCategory === 'All' || n.category === filterCategory;
            const matchesSearch = n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [notes, filterCategory, searchQuery]);

    const getCategoryColor = (category: string) => {
        const lCategory = category.toLowerCase();
        if (lCategory.includes('incident')) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
        if (lCategory.includes('customer')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
        if (lCategory.includes('maintenance')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800';
        if (lCategory.includes('general')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

        const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = [
            'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800',
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800'
        ];
        return colors[hash % colors.length];
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar (Create Note & Filters) */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">

                {/* Search & Filter */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        Search & Filter
                    </h2>

                    <div className="mb-5 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/50 outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterCategory('All')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterCategory === 'All'
                                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            All Categories
                        </button>
                        {uniqueCategories.map(category => (
                            <button
                                key={`filter-${category}`}
                                onClick={() => setFilterCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterCategory === category
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Create Note */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                        New Note
                    </h2>
                    <form onSubmit={handleCreateNote} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Type or select below..."
                                list="categories-list"
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none transition-all dark:text-white font-medium"
                                required
                            />
                            <datalist id="categories-list">
                                {uniqueCategories.map(c => (
                                    <option key={`dl-${c}`} value={c} />
                                ))}
                            </datalist>

                            {/* Quick Select Chips */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {uniqueCategories.slice(0, 5).map(c => (
                                    <button
                                        key={`quick-${c}`}
                                        type="button"
                                        onClick={() => setNewCategory(c)}
                                        className="text-[10px] font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded transition-colors"
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Content</label>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Write your note here..."
                                rows={4}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none transition-all dark:text-white resize-none font-medium placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newContent.trim() || !newCategory.trim()}
                            className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50"
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isSubmitting ? 'Saving...' : 'Save Note'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Notes List */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-800 text-sm font-medium"
                    >
                        {error}
                        <button onClick={() => setError(null)} className="ml-2 font-bold hover:underline">Dismiss</button>
                    </motion.div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-700 text-gray-500 shadow-sm"
                    >
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No notes found.</p>
                        <p className="text-sm font-medium">Create a new note or adjust your search filters.</p>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid gap-4">
                        <AnimatePresence>
                            {filteredNotes.map(note => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    key={note.id}
                                    className={`group bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm transition-all hover:shadow-md ${note.is_pinned
                                            ? 'border-yellow-400/80 dark:border-yellow-500/50 shadow-yellow-100/50 dark:shadow-none bg-gradient-to-br from-yellow-50/50 to-white dark:from-yellow-900/10 dark:to-gray-800'
                                            : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3 items-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getCategoryColor(note.category)}`}>
                                                {note.category}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                                                {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:-translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                                            <button
                                                onClick={() => handleTogglePin(note.id, note.is_pinned)}
                                                className={`p-2 rounded-xl transition-all ${note.is_pinned
                                                        ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/40 dark:hover:bg-yellow-900/60'
                                                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                                                    }`}
                                                title={note.is_pinned ? "Unpin note" : "Pin note"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={note.is_pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="12" y1="17" x2="12" y2="22"></line>
                                                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/40 transition-all"
                                                title="Delete note"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-[15px] font-medium leading-relaxed">
                                        {note.content}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
