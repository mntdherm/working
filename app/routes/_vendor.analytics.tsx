import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireVendor } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";
import { PeakHoursChart } from "~/components/vendor/analytics/PeakHoursChart";
import { PopularServicesChart } from "~/components/vendor/analytics/PopularServicesChart";
import { RetentionMetrics } from "~/components/vendor/analytics/RetentionMetrics";
import { RevenueTrends } from "~/components/vendor/analytics/RevenueTrends";
import { AnalyticsExport } from "~/components/vendor/analytics/AnalyticsExport";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));

  // Fetch bookings data
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      customer:customers(*),
      booking_services(*)
    `)
    .eq("vendor_id", vendor.id)
    .gte("created_at", lastMonthStart.toISOString())
    .lte("created_at", monthEnd.toISOString());

  // Fetch services data
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("vendor_id", vendor.id);

  // Calculate peak hours
  const peakHours = bookings?.reduce((acc: Record<number, number>, booking) => {
    const hour = new Date(booking.start_time).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  // Calculate popular services
  const popularServices = bookings?.reduce((acc: Record<string, number>, booking) => {
    booking.booking_services.forEach((service) => {
      acc[service.service_id] = (acc[service.service_id] || 0) + 1;
    });
    return acc;
  }, {});

  // Calculate customer retention
  const customerVisits = bookings?.reduce((acc: Record<string, number>, booking) => {
    acc[booking.customer_id] = (acc[booking.customer_id] || 0) + 1;
    return acc;
  }, {});

  const retentionMetrics = {
    totalCustomers: Object.keys(customerVisits || {}).length,
    returningCustomers: Object.values(customerVisits || {}).filter(visits => visits > 1).length,
    averageVisits: Object.values(customerVisits || {}).reduce((a, b) => a + b, 0) / 
      (Object.keys(customerVisits || {}).length || 1)
  };

  // Calculate revenue trends
  const revenueTrends = bookings?.reduce((acc: Record<string, number>, booking) => {
    const date = booking.created_at.split('T')[0];
    acc[date] = (acc[date] || 0) + booking.total_price;
    return acc;
  }, {});

  return json({
    peakHours,
    popularServices,
    services,
    retentionMetrics,
    revenueTrends,
    bookings
  });
};

export default function VendorAnalytics() {
  const { 
    peakHours, 
    popularServices, 
    services, 
    retentionMetrics, 
    revenueTrends,
    bookings 
  } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytiikka</h1>
        <AnalyticsExport data={{ bookings, services }} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Suosituimmat ajat</h2>
          <PeakHoursChart data={peakHours} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Suosituimmat palvelut</h2>
          <PopularServicesChart data={popularServices} services={services} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Asiakaspysyvyys</h2>
          <RetentionMetrics data={retentionMetrics} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tuloskehitys</h2>
          <RevenueTrends data={revenueTrends} />
        </div>
      </div>
    </div>
  );
}
