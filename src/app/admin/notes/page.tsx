import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';
import NotesClient from './NotesClient';

export const dynamic = 'force-dynamic';

export default function AdminNotesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Big Sky Parasail Admin</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-US', { timeZone: 'America/Denver', dateStyle: 'full' })}
                        </div>
                        <Link href="/admin/bookings" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Bookings
                        </Link>
                        <Link href="/admin/tasks" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Tasks
                        </Link>
                        <Link href="/admin/expenses" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Expenses
                        </Link>
                        <Link href="/admin/maintenance" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                            Maintenance
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Internal Notes</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Track incidents, customer interactions, and general team communications.
                    </p>
                </div>

                <NotesClient />
            </div>
        </div>
    );
}
