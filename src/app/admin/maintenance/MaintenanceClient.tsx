'use client';

import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import {
    useGetLogByDateQuery,
    useSaveLogMutation,
    AdminMaintenanceLog,
    FluidItem,
    InspectionItem,
    CustomEntry
} from '@/lib/api/maintenanceApi';

const FLUID_CATEGORIES = [
    'Engine oil level',
    'Trim Fluid',
    'Coolant',
    'Power steering level',
    'Gear lube level',
    'Hydraulic fluid'
];

const INSPECTION_CATEGORIES = [
    'Inspect belt tension',
    'Battery Condition',
    'Terminal Corrosion',
    'Raw Water Line',
    'Raw Water Pump',
    'Check auto/manual bilge pump',
    'Engine Coolant Hose',
    'Check and operate blowers',
    'Check trim switches',
    'Check VHF radio',
    'Inspect all hoses and clamps',
    'Hydraulic system',
    'Inspect Line Leveler',
    'And greases weekly',
    'Winch drum for side-to-side play',
    'Inspect all line guide rollers',
    'Inspect Roller Head for Bad Bearings',
    'Inspect Hoses',
    'Check U-Joint and grease Weekly'
];

export default function MaintenanceClient() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekStart, setWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { data: serverLog, isLoading, isFetching } = useGetLogByDateQuery(dateStr);
    const [saveLogMutation, { isLoading: isSaving }] = useSaveLogMutation();

    // Local form state mirror
    const [log, setLog] = useState<Partial<AdminMaintenanceLog>>({
        log_date: dateStr,
        inspector_name: '',
        engine_hours: null,
        fuel_gallons: null,
        fluids_data: {},
        inspections_data: {},
        custom_entries: []
    });

    // Populate local state when server data loads/changes
    useEffect(() => {
        if (!isFetching && serverLog) {
            setLog({
                ...serverLog,
                fluids_data: serverLog.fluids_data || {},
                inspections_data: serverLog.inspections_data || {},
                custom_entries: serverLog.custom_entries || [],
                inspector_name: serverLog.inspector_name || '',
                engine_hours: serverLog.engine_hours || null,
                fuel_gallons: serverLog.fuel_gallons || null,
            });
        }
    }, [serverLog, isFetching]);

    // Track week start
    useEffect(() => {
        setWeekStart(startOfWeek(selectedDate, { weekStartsOn: 1 }));
    }, [selectedDate]);

    // Handlers
    const handleSave = async () => {
        try {
            await saveLogMutation({
                ...log,
                log_date: dateStr
            }).unwrap();
            alert('Maintenance log saved successfully!');
        } catch (error) {
            console.error("Failed to save log", error);
            alert('Failed to save log.');
        }
    };

    const updateFluid = (category: string, field: keyof FluidItem, value: string) => {
        setLog(prev => ({
            ...prev,
            fluids_data: {
                ...prev.fluids_data,
                [category]: {
                    ...prev.fluids_data?.[category],
                    [field]: value,
                    ...(field === 'status' ? { amountAdded: prev.fluids_data?.[category]?.amountAdded || '' } : { status: prev.fluids_data?.[category]?.status || '' }),
                } as FluidItem
            }
        }));
    };

    const updateInspection = (category: string, status: 'Okay' | 'Discrepancy') => {
        setLog(prev => ({
            ...prev,
            inspections_data: {
                ...prev.inspections_data,
                [category]: { status }
            }
        }));
    };

    const addCustomEntry = () => {
        setLog(prev => ({
            ...prev,
            custom_entries: [
                ...(prev.custom_entries || []),
                { id: Date.now().toString(), category: '', value: '' }
            ]
        }));
    };

    const updateCustomEntry = (id: string, field: 'category' | 'value', val: string) => {
        setLog(prev => ({
            ...prev,
            custom_entries: prev.custom_entries?.map(entry =>
                entry.id === id ? { ...entry, [field]: val } : entry
            )
        }));
    };

    const removeCustomEntry = (id: string) => {
        setLog(prev => ({
            ...prev,
            custom_entries: prev.custom_entries?.filter(entry => entry.id !== id)
        }));
    };

    const calendarDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Col: Calendar Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Calendar</h2>
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setWeekStart(subDays(weekStart, 7))}
                            className="p-1 rounded hover:bg-white dark:hover:bg-slate-600 shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setWeekStart(addDays(weekStart, 7))}
                            className="p-1 rounded hover:bg-white dark:hover:bg-slate-600 shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-sm font-semibold text-slate-500 mb-3 text-center uppercase tracking-wider">
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
                                        ${isSelected ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}
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
                                    {isToday && !isSelected && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                                    {isToday && isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Save Button for Sidebar */}
                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isFetching}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Saving...' : 'Save Log'}
                    </button>

                    {serverLog?.id && (
                        <p className="text-xs text-center text-slate-500 mt-3 flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" /> Saved in database
                        </p>
                    )}
                </div>
            </div>

            {/* Right Col: Ledger Form */}
            <div className="flex-1 min-w-0 pb-12">
                {isFetching ? (
                    <div className="flex items-center justify-center h-64 text-slate-500">Loading log data...</div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Header Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inspector Name</label>
                                <input
                                    type="text"
                                    value={log.inspector_name || ''}
                                    onChange={e => setLog({ ...log, inspector_name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Engine Hours</label>
                                <input
                                    type="number"
                                    value={log.engine_hours || ''}
                                    onChange={e => setLog({ ...log, engine_hours: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fuel / Gallons</label>
                                <input
                                    type="number"
                                    value={log.fuel_gallons || ''}
                                    onChange={e => setLog({ ...log, fuel_gallons: e.target.value ? Number(e.target.value) : null })}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Start-Up Procedures: Fluids */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                Start-Up Procedure: Fluids
                            </h3>
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                                        <tr>
                                            <th className="p-3 font-semibold text-sm w-1/2">Check</th>
                                            <th className="p-3 font-semibold text-sm">Status</th>
                                            <th className="p-3 font-semibold text-sm text-right">Amt. Added</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {FLUID_CATEGORIES.map(category => {
                                            const item = log.fluids_data?.[category];
                                            return (
                                                <tr key={category} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{category}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => updateFluid(category, 'status', 'Full')}
                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${item?.status === 'Full' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-2 border-emerald-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-2 border-transparent'}`}
                                                            >
                                                                FULL
                                                            </button>
                                                            <button
                                                                onClick={() => updateFluid(category, 'status', 'Low')}
                                                                className={`px-3 py-1 rounded-full text-xs font-bold ${item?.status === 'Low' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-2 border-red-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 border-2 border-transparent'}`}
                                                            >
                                                                LOW
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 1 qt"
                                                            value={item?.amountAdded || ''}
                                                            onChange={e => updateFluid(category, 'amountAdded', e.target.value)}
                                                            className="w-full max-w-[120px] ml-auto block bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5 text-sm text-right"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Daily Inspection Checklist */}
                        <div>
                            <div className="mb-4">
                                <h3 className="text-xl font-bold flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Daily Inspection Checklist
                                </h3>
                                <div className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300 text-sm rounded-lg mt-3 flex items-start gap-2 border border-sky-100 dark:border-sky-800/50">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>Inspect Engine block, mounts, winch, and hydraulic system (NORTHEAST 32 HD Fluid). Check for salt-water deposits and unusual oil stains. Remove Engine Oil cap and inspect for milky deposits (indicates oil dilution - stop operations).</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                                        <tr>
                                            <th className="p-3 font-semibold text-sm">Inspection Item</th>
                                            <th className="p-3 font-semibold text-sm w-32 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                        {INSPECTION_CATEGORIES.map(category => {
                                            const item = log.inspections_data?.[category];
                                            return (
                                                <tr key={category} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="p-3 text-sm text-slate-700 dark:text-slate-300 font-medium">{category}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-1 justify-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                                                            <button
                                                                onClick={() => updateInspection(category, 'Okay')}
                                                                title="Okay"
                                                                className={`flex-1 flex justify-center py-1 rounded-md transition ${item?.status === 'Okay' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-emerald-500'}`}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => updateInspection(category, 'Discrepancy')}
                                                                title="Discrepancy"
                                                                className={`flex-1 flex justify-center py-1 rounded-md transition ${item?.status === 'Discrepancy' ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-red-500'}`}
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Free Solo Custom Entries */}
                        <div>
                            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                                <h3 className="text-xl font-bold">Custom Service Records</h3>
                                <button
                                    onClick={addCustomEntry}
                                    className="text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {log.custom_entries?.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">No custom maintenance entries added for this date.</p>
                                ) : (
                                    log.custom_entries?.map(entry => (
                                        <div key={entry.id} className="flex gap-3 items-center bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition">
                                            <div className="w-1/3">
                                                <input
                                                    type="text"
                                                    placeholder="Category / System"
                                                    value={entry.category}
                                                    onChange={e => updateCustomEntry(entry.id, 'category', e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Notes / Value"
                                                    value={entry.value}
                                                    onChange={e => updateCustomEntry(entry.id, 'value', e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeCustomEntry(entry.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-900/20 rounded-lg transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
