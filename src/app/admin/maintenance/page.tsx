import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';
import MaintenanceClient from './MaintenanceClient';

export const dynamic = 'force-dynamic';

export default async function AdminMaintenancePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Maintenance Log</h1>
                        <p className="text-slate-500 dark:text-slate-400">Daily pre-operational checklists & service records</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin/bookings" className="text-slate-500 hover:text-sky-600 transition-colors">
                            Bookings
                        </Link>
                        <Link href="/admin/tasks" className="text-slate-500 hover:text-sky-600 transition-colors">
                            Tasks
                        </Link>
                        <Link href="/admin/expenses" className="text-slate-500 hover:text-sky-600 transition-colors">
                            Expenses
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px] p-6">
                    <MaintenanceClient />
                </div>
            </div>
        </div>
    );
}
