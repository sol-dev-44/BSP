import LogoutButton from '@/components/admin/LogoutButton';
import Link from 'next/link';
import DiscountCodesClient from './DiscountCodesClient';

export const dynamic = 'force-dynamic';

export default async function AdminDiscountCodesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Discount Codes</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage promotional codes</p>
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
                        <Link href="/admin/maintenance" className="text-slate-500 hover:text-sky-600 transition-colors">
                            Maintenance
                        </Link>
                        <Link href="/admin/notes" className="text-slate-500 hover:text-sky-600 transition-colors">
                            Notes
                        </Link>
                        <Link href="/admin/discount-codes" className="text-sky-600 font-semibold transition-colors">
                            Discounts
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                <DiscountCodesClient />
            </div>
        </div>
    );
}
