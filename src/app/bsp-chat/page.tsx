'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function BSPChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/bsp-rag/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: input,
                    chatHistory: messages.slice(-6),
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            const assistantMsg: Message = { role: 'assistant', content: '' };

            setMessages((prev) => [...prev, assistantMsg]);

            if (reader) {
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'text') {
                                    assistantMsg.content += data.text;
                                    setMessages((prev) => {
                                        const newMsgs = [...prev];
                                        newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                                        return newMsgs;
                                    });
                                } else if (data.type === 'error') {
                                    throw new Error(data.error);
                                }
                            } catch {
                                // parse error, skip
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="w-full max-w-5xl mx-auto py-32 px-4 sm:px-6">
                {/* Title */}
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white px-6 py-3 rounded-full mb-6 shadow-lg"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-bold">AI Assistant</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-black text-foreground mb-6"
                    >
                        Ask Anything
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto"
                    >
                        Instant answers about flights, weather, pricing, and Montana.
                    </motion.p>
                </div>

                {/* Chat Interface */}
                <div className="bg-white dark:bg-[#2A1F17] rounded-2xl border-2 border-[#E5A832]/20 dark:border-[#6B4226] shadow-2xl overflow-hidden">
                    {/* Messages */}
                    <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-gradient-to-br from-[#D4605A] via-[#E07840] to-[#E5A832] rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                                >
                                    <MessageCircle className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-3xl font-bold mb-2 text-foreground">
                                    Welcome to Big Sky Parasail!
                                </h3>
                                <p className="text-foreground/60 mb-4 max-w-md text-xl">
                                    Ask me anything about parasailing on Flathead Lake! I&apos;m here to help you plan your adventure.
                                </p>
                                <p className="text-base text-foreground/40">
                                    Try: &quot;What should I bring?&quot; or &quot;How high do we go?&quot;
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-5 py-4 rounded-2xl shadow-lg ${
                                                msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white rounded-tr-sm'
                                                    : 'bg-[#FDF6E3] dark:bg-[#3D2B1F] text-foreground border border-[#E5A832]/20 dark:border-[#6B4226] rounded-tl-sm'
                                            }`}
                                        >
                                            {msg.role === 'assistant' && (
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E5A832]/20 dark:border-[#6B4226]">
                                                    <Sparkles className="w-4 h-4 text-[#D4605A]" />
                                                    <span className="font-semibold text-base">Assistant</span>
                                                </div>
                                            )}
                                            <div className="prose-base max-w-none">
                                                {msg.role === 'assistant' ? (
                                                    <ReactMarkdown
                                                        components={{
                                                            p: (props) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                            ul: (props) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                            li: (props) => <li className="pl-1" {...props} />,
                                                            strong: (props) => <strong className="font-bold text-[#D4605A]" {...props} />,
                                                            a: (props) => <a className="text-[#3B6BA5] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <p className="whitespace-pre-wrap text-lg">{msg.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-[#FDF6E3] dark:bg-[#3D2B1F] rounded-2xl rounded-tl-sm px-5 py-4 shadow-lg border border-[#E5A832]/20 dark:border-[#6B4226]">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#D4605A]" />
                                                <span className="text-foreground">Thinking...</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t-2 border-[#E5A832]/20 dark:border-[#6B4226] p-4 bg-[#FDF6E3]/50 dark:bg-[#1A0F0A]/50">
                        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your parasailing adventure..."
                                className="flex-1 min-w-0 px-4 py-3 bg-white dark:bg-[#2A1F17] border-2 border-[#E5A832]/30 dark:border-[#6B4226] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4605A] text-foreground placeholder-foreground/40"
                                disabled={loading}
                                maxLength={500}
                            />
                            <motion.button
                                type="submit"
                                disabled={!input.trim() || loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0 px-3 sm:px-6 py-3 bg-gradient-to-r from-[#D4605A] to-[#E5A832] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                <span className="hidden sm:inline">Send</span>
                            </motion.button>
                        </form>
                        <div className="mt-2 text-xs text-foreground/40">
                            {input.length}/500 characters
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
