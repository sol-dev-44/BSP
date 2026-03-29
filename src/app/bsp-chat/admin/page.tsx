'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Trash2,
    Lock,
    Unlock,
    Loader2,
    CheckCircle,
    XCircle,
    FolderOpen,
    FileUp,
    ClipboardPaste,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

const PIN_CODE = '4242';
const PIN_STORAGE_KEY = 'bsp_admin_pin';

interface Document {
    title: string;
    category: string;
    file_type: string;
    total_chunks: number;
    created_at: string;
}

const CATEGORIES = [
    { value: 'safety', label: 'Safety' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'weather', label: 'Weather' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'general', label: 'General' },
];

export default function BSPChatAdmin() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('safety');
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    useEffect(() => {
        const savedPin = localStorage.getItem(PIN_STORAGE_KEY);
        if (savedPin === PIN_CODE) {
            setIsUnlocked(true);
            loadDocuments();
        }
    }, []);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pinInput === PIN_CODE) {
            localStorage.setItem(PIN_STORAGE_KEY, PIN_CODE);
            setIsUnlocked(true);
            setPinError(false);
            loadDocuments();
        } else {
            setPinError(true);
            setTimeout(() => setPinError(false), 2000);
        }
        setPinInput('');
    };

    const handleLock = () => {
        localStorage.removeItem(PIN_STORAGE_KEY);
        setIsUnlocked(false);
    };

    const loadDocuments = async () => {
        setLoadingDocs(true);
        try {
            const response = await fetch('/api/bsp-rag/upload');
            const data = await response.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (!title) setTitle(file.name.replace(/\.(pdf|txt)$/, ''));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            setUploadStatus({ type: 'error', message: 'Title is required' });
            return;
        }
        if (uploadMethod === 'file' && !selectedFile) {
            setUploadStatus({ type: 'error', message: 'Please select a file' });
            return;
        }
        if (uploadMethod === 'text' && !textInput.trim()) {
            setUploadStatus({ type: 'error', message: 'Please enter some text' });
            return;
        }

        setUploading(true);
        setUploadStatus({ type: null, message: '' });

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);

            if (uploadMethod === 'file' && selectedFile) {
                formData.append('file', selectedFile);
            } else {
                formData.append('text', textInput);
            }

            const response = await fetch('/api/bsp-rag/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadStatus({ type: 'success', message: `Uploaded ${data.chunks} chunks!` });
                setSelectedFile(null);
                setTextInput('');
                setTitle('');
                loadDocuments();
            } else {
                setUploadStatus({ type: 'error', message: data.error || 'Upload failed' });
            }
        } catch {
            setUploadStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docTitle: string) => {
        if (!confirm(`Delete "${docTitle}"?`)) return;

        try {
            const response = await fetch(`/api/bsp-rag/upload?title=${encodeURIComponent(docTitle)}`, {
                method: 'DELETE',
            });
            if (response.ok) loadDocuments();
            else alert('Failed to delete document');
        } catch {
            alert('Network error');
        }
    };

    if (!isUnlocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B5383B] via-[#00f0ff] to-[#3B6BA5] p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-[#111128] rounded-2xl shadow-2xl p-8 max-w-md w-full"
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00f0ff] to-[#ff00ff] rounded-2xl flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-2 text-foreground">
                        BSP Document Admin
                    </h1>
                    <p className="text-center text-foreground/60 mb-6">
                        Enter PIN to manage knowledge base
                    </p>
                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="Enter PIN"
                            className={`w-full px-4 py-3 bg-[#0d0d1f] dark:bg-[#1A0F0A] border ${pinError ? 'border-red-500' : 'border-[#ff00ff]/30 dark:border-[#7b2dff]'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00f0ff] text-center text-2xl tracking-widest mb-4 text-foreground`}
                            maxLength={4}
                            autoFocus
                        />
                        <AnimatePresence>
                            {pinError && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-red-500 text-sm text-center mb-4"
                                >
                                    Incorrect PIN
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Unlock
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] bg-clip-text text-transparent">
                            BSP Document Management
                        </h1>
                        <p className="text-foreground/60 mt-1">
                            Upload and manage parasailing knowledge base
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">Home</Link>
                        <Link href="/bsp-chat" className="text-sm text-[#00f0ff] hover:text-[#ff00ff]">Chat</Link>
                        <ThemeToggle />
                        <button
                            onClick={handleLock}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0d0d1f] dark:bg-[#111128] text-foreground rounded-lg hover:bg-[#ff00ff]/20 transition-colors"
                        >
                            <Unlock className="w-4 h-4" />
                            Lock
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Upload */}
                    <div className="bg-white dark:bg-[#111128] rounded-2xl border border-[#ff00ff]/20 dark:border-[#7b2dff] shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#00f0ff]" />
                            Upload Document
                        </h2>

                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setUploadMethod('file')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'file' ? 'bg-[#00f0ff] text-white' : 'bg-[#0d0d1f] dark:bg-[#1A0F0A] text-foreground'}`}
                            >
                                <FileUp className="w-4 h-4 inline mr-2" />
                                File
                            </button>
                            <button
                                onClick={() => setUploadMethod('text')}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'text' ? 'bg-[#00f0ff] text-white' : 'bg-[#0d0d1f] dark:bg-[#1A0F0A] text-foreground'}`}
                            >
                                <ClipboardPaste className="w-4 h-4 inline mr-2" />
                                Paste Text
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Document title"
                                    className="w-full px-4 py-2 bg-[#0d0d1f] dark:bg-[#1A0F0A] border border-[#ff00ff]/30 dark:border-[#7b2dff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f0ff] text-foreground"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 bg-[#0d0d1f] dark:bg-[#1A0F0A] border border-[#ff00ff]/30 dark:border-[#7b2dff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f0ff] text-foreground"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {uploadMethod === 'file' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">File (PDF or TXT)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.txt"
                                        onChange={handleFileSelect}
                                        className="w-full px-4 py-2 bg-[#0d0d1f] dark:bg-[#1A0F0A] border border-[#ff00ff]/30 dark:border-[#7b2dff] rounded-lg text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00f0ff]/10 file:text-[#00f0ff]"
                                    />
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-foreground/60">Selected: {selectedFile.name}</p>
                                    )}
                                </div>
                            )}

                            {uploadMethod === 'text' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Text Content</label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        placeholder="Paste or type your text here..."
                                        rows={8}
                                        className="w-full px-4 py-2 bg-[#0d0d1f] dark:bg-[#1A0F0A] border border-[#ff00ff]/30 dark:border-[#7b2dff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00f0ff] resize-none text-foreground"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-3 bg-gradient-to-r from-[#00f0ff] to-[#ff00ff] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                                ) : (
                                    <><Upload className="w-5 h-5" /> Upload Document</>
                                )}
                            </button>

                            <AnimatePresence>
                                {uploadStatus.type && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`p-4 rounded-lg flex items-center gap-2 ${uploadStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
                                    >
                                        {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        {uploadStatus.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Documents List */}
                    <div className="bg-white dark:bg-[#111128] rounded-2xl border border-[#ff00ff]/20 dark:border-[#7b2dff] shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-[#00f0ff]" />
                                Uploaded Documents
                            </h2>
                            <button
                                onClick={loadDocuments}
                                disabled={loadingDocs}
                                className="text-sm text-[#00f0ff] hover:text-[#ff00ff] disabled:opacity-50"
                            >
                                {loadingDocs ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {documents.length === 0 ? (
                                <div className="text-center py-12 text-foreground/40">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No documents uploaded yet</p>
                                </div>
                            ) : (
                                documents.map((doc, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 bg-[#0d0d1f] dark:bg-[#1A0F0A] rounded-lg border border-[#ff00ff]/20 dark:border-[#7b2dff] hover:border-[#00f0ff] transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">{doc.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-foreground/60">
                                                    <span className="px-2 py-0.5 bg-[#00f0ff]/10 text-[#00f0ff] rounded-full text-xs font-medium">
                                                        {CATEGORIES.find((c) => c.value === doc.category)?.label}
                                                    </span>
                                                    <span>{doc.total_chunks} chunks</span>
                                                    <span>{doc.file_type.toUpperCase()}</span>
                                                </div>
                                                <p className="text-xs text-foreground/40 mt-1">
                                                    {new Date(doc.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(doc.title)}
                                                className="p-2 text-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
