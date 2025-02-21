import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { requireVendor } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";
import { CalendarView } from "~/components/vendor/calendar/CalendarView";
import { AppointmentDetails } from "~/components/vendor/calendar/AppointmentDetails";
import { AvailabilityManager } from "~/components/vendor/calendar/AvailabilityManager";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ? new Date(url.searchParams.get("date")!) : new Date();
  const view = url.searchParams.get("view") || "month";

  let start, end;
  switch (view) {
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date, { weekStartsOn: 1 });
      end = endOfWeek(date, { weekStartsOn: 1 });
      break;
    default:
      start = startOfDay(date);
      end = endOfDay(date);
  }

  const [appointments, blockedTimes] = await Promise.all([
    supabase
      .from("bookings")
      .select(`
        *,
        customer:customers(*),
        booking_services:booking_services(*)
      `)
      .eq("vendor_id", vendor.id)
      .gte("start_time", start.toISOString())
      .lte("end_time", end.toISOString()),
    
    supabase
      .from("blocked_times")
      .select("*")
      .eq("vendor_id", vendor.id)
      .gte("start_time", start.toISOString())
      .lte("end_time", end.toISOString())
  ]);

  return json({
    appointments: appointments.data || [],
    blockedTimes: blockedTimes.data || [],
    vendor
  });
};

export default function CalendarManagement() {
  const { appointments, blockedTimes, vendor } = useLoaderData<typeof loader>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Kalenteri</h1>
        <div className="flex space-x-4">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as "month" | "week" | "day")}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="month">Kuukausi</option>
            <option value="week">Viikko</option>
            <option value="day">Päivä</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setSelectedDate(new Date())}
          >
            Tänään
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalendarView
            view={view}
            date={selectedDate}
            appointments={appointments}
            blockedTimes={blockedTimes}
            onDateSelect={setSelectedDate}
            onAppointmentSelect={setSelectedAppointment}
          />
        </div>
        
        <div className="space-y-6">
          {selectedAppointment && (
            <AppointmentDetails
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
            />
          )}
          
          <AvailabilityManager
            vendorId={vendor.id}
            date={selectedDate}
            blockedTimes={blockedTimes}
          />
        </div>
      </div>
    </div>
  );
}
