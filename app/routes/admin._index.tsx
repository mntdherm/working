import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAdmin } from "~/lib/auth.server";
import { supabase } from "~/lib/supabase.server";
import { PlatformStats } from "~/components/admin/PlatformStats";
import { VendorList } from "~/components/admin/VendorList";
import { RecentBookings } from "~/components/admin/RecentBookings";
import { RevenueReport } from "~/components/admin/RevenueReport";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdmin(request);
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  const timeRange = searchParams.get("timeRange") || "month";
  const vendorFilter = searchParams.get("vendor") || "";
  const statusFilter = searchParams.get("status") || "";

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));

  // Fetch platform statistics
  const [
    { count: totalVendors },
    { count: totalCustomers },
    { count: totalBookings },
    { data: revenueData }
  ] = await Promise.all([
    supabase.from("vendors").select("*", { count: "exact" }),
    supabase.from("customers").select("*", { count: "exact" }),
    supabase.from("bookings").select("*", { count: "exact" }),
    supabase.from("bookings")
      .select("total_price")
      .gte("created_at", lastMonthStart.toISOString())
  ]);

  const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

  // Fetch vendors with filters
  const vendorQuery = supabase
    .from("vendors")
    .select(`
      *,
      bookings(count),
      services(count)
    `);

  if (vendorFilter) {
    vendorQuery.ilike("business_name", `%${vendorFilter}%`);
  }

  const { data: vendors } = await vendorQuery;

  // Fetch recent bookings with filters
  const bookingQuery = supabase
    .from("bookings")
    .select(`
      *,
      vendor:vendors(business_name),
      customer:customers(name, email),
      booking_services(
        service:services(name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  if (statusFilter) {
    bookingQuery.eq("status", statusFilter);
  }

  const { data: recentBookings } = await bookingQuery;

  return json({
    stats: {
      totalVendors,
      totalCustomers,
      totalBookings,
      totalRevenue
    },
    vendors,
    recentBookings,
    filters: {
      timeRange,
      vendorFilter,
      statusFilter
    }
  });
};

export default function AdminDashboard() {
  const { stats, vendors, recentBookings, filters } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Hallintapaneeli</h1>

      <div className="space-y-8">
        <PlatformStats stats={stats} />

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Palveluntarjoajat</h2>
            <VendorList vendors={vendors} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Viimeisimmät varaukset</h2>
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tulot</h2>
            <RevenueReport bookings={recentBookings} timeRange={filters.timeRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
