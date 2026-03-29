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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BOOKING_CONFIG, isWithinSeason, isDayOfWeekAllowed } from '@/config/booking';

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
            const isDisabled = isPast || !isInSeason || !isAllowedDay;
            const isSelected = selectedDate === dateString;

            days.push(
                <button
                    key={day.toString()}
                    disabled={isDisabled}
                    onClick={() => onSelectDate(dateString)}
                    className={`
                        relative h-14 w-full flex items-center justify-center rounded-lg transition-all duration-200
                        ${!isSameMonth(day, monthStart) ? "text-[#2a2a4a] opacity-50" : ""}
                        ${isDisabled ? "text-[#2a2a4a] cursor-not-allowed bg-[#050510]" : "hover:bg-[#00f0ff]/10 cursor-pointer text-[#e0f0ff] font-medium"}
                        ${isSelected ? "!bg-[#00f0ff] !text-[#001a1f] shadow-lg shadow-[#00f0ff]/30 scale-105 z-10 font-bold" : ""}
                    `}
                >
                    {formattedDate}
                    {isAllowedDay && !isDisabled && !isSelected && (
                        <span className="absolute bottom-2 w-1 h-1 bg-[#00f0ff] rounded-full"></span>
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
            <div className="bg-[#111128] rounded-2xl shadow-xl border border-[#2a2a4a] p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#e0f0ff] capitalize font-serif">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-[#1a1a3e] bg-[#111128] rounded-full text-[#e0f0ff] transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-[#1a1a3e] bg-[#111128] rounded-full text-[#e0f0ff] transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 mb-4 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                        <div key={dayName} className="text-xs font-semibold uppercase text-[#5a6a8a] tracking-wider">
                            {dayName}
                        </div>
                    ))}
                </div>

                <div>{rows}</div>
            </div>

            {/* Location & Schedule Notice */}
            <div className="bg-[#ff00ff]/10 rounded-xl p-4 border border-[#ff00ff]/30 text-sm">
                <p className="font-semibold text-[#e0f0ff] mb-2">Season Schedule:</p>
                <div className="space-y-1 text-[#b0c4de]">
                    {BOOKING_CONFIG.locationSchedule.map((schedule, idx) => (
                        <p key={idx}>
                            {schedule.location}: {format(new Date(schedule.startDate + 'T12:00:00'), 'MMM d')} - {format(new Date(schedule.endDate + 'T12:00:00'), 'MMM d')}
                        </p>
                    ))}
                </div>
                <p className="mt-3 text-xs text-[#5a6a8a]">
                    Available 7 days a week during season
                </p>
            </div>
        </div>
    );
}
