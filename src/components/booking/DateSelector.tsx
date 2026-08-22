import { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isBefore,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Sunset } from 'lucide-react';
import { BOOKING_CONFIG, isWithinSeason, isDayOfWeekAllowed, isAfterSeasonEnd, isSeasonLastDay } from '@/config/booking';

const BLOCKED_DATES = new Set<string>([
    '2026-05-26',
    '2026-05-28',
    '2026-05-30',
    '2026-05-31',
    '2026-06-01',
    '2026-06-02',
]);

interface DateSelectorProps {
    selectedDate: string; // YYYY-MM-DD
    onSelectDate: (date: string) => void;
    minDate?: string; // YYYY-MM-DD
}

export default function DateSelector({ selectedDate, onSelectDate, minDate }: DateSelectorProps) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const parts = selectedDate.split('-');
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const minDateObj = minDate ? new Date(parseInt(minDate.split('-')[0]), parseInt(minDate.split('-')[1]) - 1, parseInt(minDate.split('-')[2])) : new Date();

    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);

            const year = day.getFullYear();
            const month = String(day.getMonth() + 1).padStart(2, '0');
            const dateNum = String(day.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${dateNum}`;

            const dayOfWeek = day.getDay();
            const isInSeason = isWithinSeason(day);
            const isAllowedDay = isDayOfWeekAllowed(dayOfWeek, day);

            const isPast = isBefore(day, minDateObj);
            const isBlocked = BLOCKED_DATES.has(dateString);
            // Past the last day the boat runs — still rendered, just quietly closed.
            const isPostSeason = isAfterSeasonEnd(dateString);
            const isLastDay = isSeasonLastDay(dateString);
            const isDisabled = isPast || !isInSeason || !isAllowedDay || isBlocked || isPostSeason;
            const isSelected = selectedDate === dateString;
            const isToday = dateString === todayString;

            days.push(
                <button
                    key={day.toString()}
                    disabled={isDisabled}
                    aria-disabled={isDisabled || undefined}
                    title={isPostSeason ? 'Season has ended' : isLastDay ? 'Last day of the 2026 season' : undefined}
                    onClick={() => onSelectDate(dateString)}
                    className={`
                        relative h-14 w-full flex items-center justify-center rounded-lg transition-all duration-200
                        ${!isSameMonth(day, monthStart) ? "text-[#DCC8A0] opacity-50" : ""}
                        ${isDisabled ? "text-[#DCC8A0] cursor-not-allowed bg-[#FFFFFF]" : "hover:bg-[#FF9500]/10 cursor-pointer text-[#2D1600] font-medium"}
                        ${isPostSeason && isSameMonth(day, monthStart) ? "!bg-[#FBF7F1] !text-[#C9B79A] opacity-70" : ""}
                        ${isPast && isSameMonth(day, monthStart) ? "line-through decoration-[#DCC8A0]/70" : ""}
                        ${isLastDay && !isSelected ? "ring-1 ring-[#FF9500]/40 bg-[#FF9500]/[0.06]" : ""}
                        ${isToday && !isSelected ? "ring-2 ring-[#FFD700] ring-offset-2 ring-offset-[#FFEACC]" : ""}
                        ${isSelected ? "!bg-[#FF9500] !text-[#FFFFFF] shadow-lg shadow-[#FF9500]/30 scale-105 z-10 font-bold" : ""}
                    `}
                >
                    {formattedDate}
                    {isLastDay && !isSelected && (
                        <Sunset className="absolute bottom-1.5 w-3 h-3 text-[#C24E00]/70" strokeWidth={2} aria-hidden />
                    )}
                    {isAllowedDay && !isDisabled && !isSelected && !isLastDay && (
                        <span className="absolute bottom-2 w-1 h-1 bg-[#FF9500] rounded-full"></span>
                    )}
                </button>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="grid grid-cols-7 gap-2 mb-2" key={day.toString()}>
                {days}
            </div>
        );
        days = [];
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="bg-[#FFEACC] rounded-2xl shadow-xl border border-[#DCC8A0] p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#2D1600] uppercase tracking-wide font-[family-name:var(--font-headline)]">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} aria-label="Previous month" className="p-2 hover:bg-[#FFD699] bg-[#FFEACC] rounded-full text-[#2D1600] transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} aria-label="Next month" className="p-2 hover:bg-[#FFD699] bg-[#FFEACC] rounded-full text-[#2D1600] transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                        <div key={dayName} className="text-xs font-semibold uppercase text-[#8B6914] tracking-wider">
                            {dayName}
                        </div>
                    ))}
                </div>

                <div>{rows}</div>
            </div>

            {/* Location & Schedule Notice */}
            <div className="bg-[#FFD700]/10 rounded-xl p-4 border border-[#FFD700]/30 text-sm">
                <p className="font-semibold text-[#2D1600] mb-2">Season Schedule:</p>
                <div className="space-y-1 text-[#614020]">
                    {BOOKING_CONFIG.locationSchedule.map((schedule, idx) => (
                        <p key={idx}>
                            {schedule.location}: {format(new Date(schedule.startDate + 'T12:00:00'), 'MMM d')} - {format(new Date(schedule.endDate + 'T12:00:00'), 'MMM d')}
                        </p>
                    ))}
                </div>
                <p className="mt-3 text-xs text-[#8B6914]">
                    Sat &amp; Sun: all day &middot; Mon-Fri: 3 PM - sunset
                </p>
                <p className="mt-3 pt-3 border-t border-[#FFD700]/25 text-xs text-[#8B6914] flex items-center gap-1.5">
                    <Sunset className="w-3.5 h-3.5 text-[#C24E00]/70 shrink-0" strokeWidth={2} aria-hidden />
                    <span>
                        {format(new Date(BOOKING_CONFIG.SEASON_LAST_DAY + 'T12:00:00'), 'MMM d')} is our last day of the {format(new Date(BOOKING_CONFIG.SEASON_LAST_DAY + 'T12:00:00'), 'yyyy')} season &mdash; dates after are closed until next May.
                    </span>
                </p>
            </div>
        </div>
    );
}
