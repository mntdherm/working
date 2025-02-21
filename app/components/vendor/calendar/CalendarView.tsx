import { format, isSameDay, isSameMonth, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fi } from 'date-fns/locale';
import type { Appointment, BlockedTime } from '~/types/calendar';

interface CalendarViewProps {
  view: "month" | "week" | "day";
  date: Date;
  appointments: Appointment[];
  blockedTimes: BlockedTime[];
  onDateSelect: (date: Date) => void;
  onAppointmentSelect: (appointment: Appointment) => void;
}

export function CalendarView({
  view,
  date,
  appointments,
  blockedTimes,
  onDateSelect,
  onAppointmentSelect,
}: CalendarViewProps) {
  const renderMonthView = () => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const startDate = startOfWeek(start, { weekStartsOn: 1 });
    const endDate = endOfWeek(end, { weekStartsOn: 1 });

    const weeks = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(currentDate);
        currentDate = addDays(currentDate, 1);
      }
      weeks.push(week);
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
          {['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'].map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weeks.map((week, weekIndex) => (
            week.map((day, dayIndex) => {
              const dayAppointments = appointments.filter(apt => 
                isSameDay(new Date(apt.start_time), day)
              );
              const isBlocked = blockedTimes.some(block => 
                isSameDay(new Date(block.start_time), day)
              );

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] bg-white p-2 ${
                    !isSameMonth(day, date) ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => onDateSelect(day)}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm ${
                      isSameDay(day, new Date()) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {isBlocked && (
                      <span className="text-xs text-red-600">Suljettu</span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {dayAppointments.map(apt => (
                      <button
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentSelect(apt);
                        }}
                        className="block w-full text-left text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                      >
                        {format(new Date(apt.start_time), 'HH:mm')} - {apt.customer.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
          {days.map((day) => (
            <div key={day.toISOString()} className="px-2 py-3">
              <div className="text-sm font-medium text-gray-500">
                {format(day, 'EEEEEE', { locale: fi })}
              </div>
              <div className={`text-sm ${
                isSameDay(day, new Date()) ? 'text-blue-600 font-semibold' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const dayAppointments = appointments.filter(apt => 
              isSameDay(new Date(apt.start_time), day)
            );

            return (
              <div key={day.toISOString()} className="min-h-[400px] bg-white p-2">
                {dayAppointments.map(apt => (
                  <button
                    key={apt.id}
                    onClick={() => onAppointmentSelect(apt)}
                    className="block w-full text-left text-sm p-2 mb-2 rounded bg-blue-100 text-blue-800"
                  >
                    <div className="font-medium">
                      {format(new Date(apt.start_time), 'HH:mm')}
                    </div>
                    <div className="truncate">{apt.customer.name}</div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayAppointments = appointments.filter(apt => 
      isSameDay(new Date(apt.start_time), date)
    );

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {format(date, 'EEEE d.M.yyyy', { locale: fi })}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {hours.map((hour) => {
            const hourAppointments = dayAppointments.filter(apt => 
              new Date(apt.start_time).getHours() === hour
            );

            return (
              <div key={hour} className="flex">
                <div className="w-20 py-2 text-right text-sm text-gray-500">
                  {hour}:00
                </div>
                <div className="flex-1 px-4 py-2">
                  {hourAppointments.map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onAppointmentSelect(apt)}
                      className="block w-full text-left text-sm p-2 mb-2 rounded bg-blue-100 text-blue-800"
                    >
                      <div className="font-medium">
                        {format(new Date(apt.start_time), 'HH:mm')} - {apt.customer.name}
                      </div>
                      <div className="text-xs text-blue-600">
                        {apt.booking_services.map(service => service.name).join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
}
