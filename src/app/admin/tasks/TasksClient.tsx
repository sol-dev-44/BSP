'use client';

import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import {
    useGetTodosByDateQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
    useReorderTodosMutation,
    AdminTodo,
} from '@/lib/api/todosApi';
import SuppliesModal from '@/components/admin/SuppliesModal';
import {
    CheckCircle2,
    Circle,
    GripVertical,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    Copy,
    Check,
    Calendar,
    ShoppingCart,
} from 'lucide-react';

export default function TasksClient() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [items, setItems] = useState<AdminTodo[]>([]);
    const [copied, setCopied] = useState(false);
    const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
    const [changeDateOpen, setChangeDateOpen] = useState<Record<string, boolean>>({});
    const [suppliesOpen, setSuppliesOpen] = useState(false);

    // Expandable calendar state (week view vs exact day)
    const [weekStart, setWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { data: todos, isLoading } = useGetTodosByDateQuery(dateStr);
    const [addTodo] = useAddTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();
    const [reorderTodos] = useReorderTodosMutation();

    // Sort: pending items first, completed items last
    const sortItems = (arr: AdminTodo[]) => {
        const pending = arr.filter(t => !t.is_completed).sort((a, b) => a.rank - b.rank);
        const done = arr.filter(t => t.is_completed).sort((a, b) => a.rank - b.rank);
        return [...pending, ...done];
    };

    useEffect(() => {
        if (todos) {
            setItems(sortItems([...todos]));
        }
    }, [todos]);

    useEffect(() => {
        setWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }, [selectedDate]);

    // Copy the date title to clipboard
    const handleCopyTitle = async () => {
        const title = `Tasks for ${format(selectedDate, 'EEEE, MMMM d')}`;
        await navigator.clipboard.writeText(title);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await addTodo({
                title: newTaskTitle.trim(),
                task_date: dateStr,
                rank: items.filter(t => !t.is_completed).length,
            }).unwrap();
            setNewTaskTitle('');
        } catch (err) {
            console.error('Failed to add task', err);
        }
    };

    const handleToggleComplete = async (todo: AdminTodo) => {
        try {
            const updatedItems = items.map(t =>
                t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
            );
            setItems(sortItems(updatedItems));

            await updateTodo({
                id: todo.id,
                is_completed: !todo.is_completed,
            }).unwrap();
        } catch (err) {
            console.error('Failed to toggle task', err);
            if (todos) setItems(sortItems([...todos]));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this task?')) return;
        try {
            await deleteTodo(id).unwrap();
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    // Move a todo to a different date
    const handleChangeDate = async (todo: AdminTodo, newDate: string) => {
        try {
            await updateTodo({ id: todo.id, task_date: newDate }).unwrap();
            setChangeDateOpen(prev => ({ ...prev, [todo.id]: false }));
        } catch (err) {
            console.error('Failed to change date', err);
        }
    };

    const handleReorder = async (newOrder: AdminTodo[]) => {
        setItems(newOrder);

        const updatedTodos = newOrder.map((todo, index) => ({
            ...todo,
            rank: index,
        }));

        try {
            await reorderTodos({ todos: updatedTodos }).unwrap();
        } catch (err) {
            console.error('Failed to reorder tasks', err);
            if (todos) setItems(sortItems([...todos]));
        }
    };

    // Calendar Days
    const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // BSP color palette:
    // Primary: sky-600
    // Accent:  sky-500 (lighter)
    // Dark:    sky-700 (deep)
    // Completed green: emerald-500

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Col: Calendar Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-sky-600 dark:text-sky-400">Calendar</h2>
                    <div className="flex bg-sky-50 dark:bg-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setWeekStart(subDays(weekStart, 7))}
                            className="p-1 rounded hover:bg-white dark:hover:bg-slate-600 shadow-sm text-sky-600 dark:text-sky-400"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setWeekStart(addDays(weekStart, 7))}
                            className="p-1 rounded hover:bg-white dark:hover:bg-slate-600 shadow-sm text-sky-600 dark:text-sky-400"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-4 border border-sky-200 dark:border-slate-700">
                    <div className="text-sm font-semibold text-sky-600 mb-3 text-center uppercase tracking-wider">
                        {format(weekStart, 'MMM yyyy')}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {calendarDays.map(day => {
                            const isSelected = isSameDay(day, selectedDate);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`flex items-center justify-between p-3 rounded-lg text-left transition-colors
                                        ${isSelected
                                            ? 'bg-sky-600 text-white shadow-md'
                                            : 'hover:bg-sky-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800'}
                                    `}
                                >
                                    <div>
                                        <div className={`text-xs ${isSelected ? 'text-sky-200' : 'text-slate-500'}`}>
                                            {format(day, 'EEEE')}
                                        </div>
                                        <div className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {format(day, 'MMM d')}
                                        </div>
                                    </div>
                                    {isToday && !isSelected && (
                                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                                    )}
                                    {isToday && isSelected && (
                                        <span className="w-2 h-2 rounded-full bg-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Col: Tasks */}
            <div className="flex-1 min-w-0">
                <div className="mb-6 flex justify-between items-end border-b border-sky-200 dark:border-slate-700 pb-4">
                    <div>
                        {/* Copyable title */}
                        <button
                            onClick={handleCopyTitle}
                            title="Click to copy title"
                            className="group flex items-center gap-2 text-left focus:outline-none"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                Tasks for {format(selectedDate, 'EEEE, MMMM d')}
                            </h2>
                            <span className="text-slate-400 group-hover:text-sky-600 transition-colors">
                                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </span>
                        </button>
                        <p className="text-slate-500 mt-1">
                            {copied ? (
                                <span className="text-emerald-500 font-medium">Copied to clipboard!</span>
                            ) : (
                                'Drag to reorder. Completed items sink to the bottom.'
                            )}
                        </p>
                    </div>

                    {/* Supplies CTA */}
                    <button
                        onClick={() => setSuppliesOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg active:scale-95"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Supplies List
                    </button>
                </div>

                {/* Supplies Modal */}
                {suppliesOpen && <SuppliesModal onClose={() => setSuppliesOpen(false)} />}

                <form onSubmit={handleAddTodo} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 px-4 py-3 rounded-xl border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim() || isLoading}
                        className="bg-sky-600 text-white px-6 py-3 justify-center rounded-xl font-medium hover:bg-sky-700 transition flex items-center gap-2 disabled:opacity-50 shadow-md"
                    >
                        <Plus className="w-5 h-5" /> Add Task
                    </button>
                </form>

                {isLoading ? (
                    <div className="flex justify-center p-8 text-sky-600">Loading tasks...</div>
                ) : items.length === 0 ? (
                    <div className="text-center p-12 bg-sky-50 dark:bg-slate-900 rounded-xl border border-sky-200 dark:border-slate-800 border-dashed">
                        <p className="text-slate-500">No tasks planned for this day yet.</p>
                        <button
                            onClick={() => document.querySelector('input')?.focus()}
                            className="mt-4 text-sky-600 font-medium hover:underline focus:outline-none"
                        >
                            Add your first task
                        </button>
                    </div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={items}
                        onReorder={handleReorder}
                        className="space-y-3"
                    >
                        {items.map((todo) => (
                            <Reorder.Item
                                key={todo.id}
                                value={todo}
                                className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm group transition-all
                                    ${todo.is_completed
                                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
                                        : 'bg-white dark:bg-slate-800 border-sky-200 dark:border-slate-600 hover:border-sky-600 hover:shadow-md'}
                                `}
                            >
                                <div className="cursor-grab active:cursor-grabbing text-sky-600/40 hover:text-sky-600 p-1 transition-colors">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                <button
                                    onClick={() => handleToggleComplete(todo)}
                                    className={`flex-shrink-0 transition-colors ${todo.is_completed ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
                                >
                                    {todo.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                </button>

                                <span className={`flex-1 text-lg truncate ${todo.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white font-medium'}`}>
                                    {todo.title}
                                </span>

                                {/* Copy todo title */}
                                <button
                                    title="Copy task title"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(todo.title);
                                        setCopiedItemId(todo.id);
                                        setTimeout(() => setCopiedItemId(null), 2000);
                                    }}
                                    className="p-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-600/10 rounded-lg transition"
                                >
                                    {copiedItemId === todo.id
                                        ? <Check className="w-4 h-4 text-emerald-500" />
                                        : <Copy className="w-4 h-4" />}
                                </button>

                                {/* Change Date button + date picker */}
                                <div className="relative">
                                    <button
                                        onClick={() => setChangeDateOpen(prev => ({ ...prev, [todo.id]: !prev[todo.id] }))}
                                        title="Move to another date"
                                        className="p-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-600/10 rounded-lg transition"
                                    >
                                        <Calendar className="w-4 h-4" />
                                    </button>
                                    {changeDateOpen[todo.id] && (
                                        <div className="absolute right-0 top-10 z-50 bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-600 rounded-xl shadow-xl p-3 min-w-[220px]">
                                            <p className="text-xs font-semibold text-sky-600 mb-2 uppercase tracking-wide">Move to date</p>
                                            <input
                                                type="date"
                                                defaultValue={todo.task_date}
                                                className="w-full px-3 py-2 rounded-lg border border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleChangeDate(todo, e.target.value);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => setChangeDateOpen(prev => ({ ...prev, [todo.id]: false }))}
                                                className="mt-2 w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="p-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                    title="Delete task"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>
        </div>
    );
}
