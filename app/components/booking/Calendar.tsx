import { useState } from "react";
import type { TimeSlot } from "~/types/booking";

interface CalendarProps {
  date: Date;
  timeSlots: TimeSlot[];
  selectedSlot?: TimeSlot;
  onDateChange: (date: Date) => void;
  onSlotSelect: (slot: TimeSlot) => void;
}

export default function Calendar({
  date,
  timeSlots,
  selectedSlot,
  onDateChange,
  onSlotSelect,
}: CalendarProps) {
  const [view, setView] = useState<"month" | "day">("month");

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setView("month")}
              className={`px-3 py-1 rounded-md ${
                view === "month"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Kuukausi
            </button>
            <button
              type="button"
              onClick={() => setView("day")}
              className={`px-3 py-1 rounded-md ${
                view === "day"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Päivä
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <span className="sr-only">Edellinen</span>
              {/* Previous icon */}
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {date.toLocaleDateString("fi-FI", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <span className="sr-only">Seuraava</span>
              {/* Next icon */}
            </button>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {view === "day" && (
        <div className="divide-y divide-gray-200">
          {timeSlots.map((slot) => (
            <button
              key={slot.startTime.toISOString()}
              onClick={() => slot.available && onSlotSelect(slot)}
              disabled={!slot.available}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                !slot.available && "opacity-50 cursor-not-allowed"
              } ${
                selectedSlot?.startTime === slot.startTime
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {slot.startTime.toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {slot.endTime.toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {!slot.available && (
                  <span className="text-xs text-gray-500">Varattu</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Month View */}
      {view === "month" && (
        <div className="p-4">
          {/* Month calendar implementation */}
          {/* This would show a traditional calendar view */}
          {/* When a date is selected, switch to day view */}
        </div>
      )}
    </div>
  );
}
