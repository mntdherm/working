import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireVendor } from "~/lib/auth.server";
import { DashboardStats } from "~/components/vendor/dashboard/DashboardStats";
import { TodayAppointments } from "~/components/vendor/dashboard/TodayAppointments";
import { RecentBookings } from "~/components/vendor/dashboard/RecentBookings";
import { IncomeChart } from "~/components/vendor/dashboard/IncomeChart";
import { PendingReviews } from "~/components/vendor/dashboard/PendingReviews";
import { supabase } from "~/lib/supabase.server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export const loader: LoaderFunction = async ({ request }) => {
  const vendor = await requireVendor(request);
  const today = new Date();

  // Fetch today's appointments
  const { data: todayAppointments } = await supabase
    .from("bookings")
    .select("*, customer:customers(*)")
    .eq("vendor_id", vendor.id)
    .gte("start_time", startOfDay(today).toISOString())
    .lte("start_time", endOfDay(today).toISOString())
    .order("start_time");

  // Fetch recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, customer:customers(*)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch monthly income
  const { data: monthlyBookings } = await supabase
    .from("bookings")
    .select("total_price, created_at")
    .eq("vendor_id", vendor.id)
    .eq("status", "completed")
    .gte("created_at", startOfMonth(today).toISOString())
    .lte("created_at", endOfMonth(today).toISOString());

  // Fetch pending reviews
  const { data: pendingReviews } = await supabase
    .from("bookings")
    .select("*, customer:customers(*)")
    .eq("vendor_id", vendor.id)
    .eq("status", "completed")
    .is("review", null)
    .limit(5);

  // Calculate dashboard stats
  const totalIncome = monthlyBookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;
  const totalBookings = monthlyBookings?.length || 0;
  const averageBookingValue = totalBookings > 0 ? totalIncome / totalBookings : 0;

  return json({
    todayAppointments,
    recentBookings,
    monthlyBookings,
    pendingReviews,
    stats: {
      totalIncome,
      totalBookings,
      averageBookingValue,
      pendingReviewsCount: pendingReviews?.length || 0
    }
  });
};

export default function VendorDashboard() {
  const { 
    todayAppointments, 
    recentBookings, 
    monthlyBookings, 
    pendingReviews,
    stats 
  } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Hallintapaneeli</h1>
      
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tämän päivän varaukset</h2>
            <TodayAppointments appointments={todayAppointments} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Viimeisimmät varaukset</h2>
            <RecentBookings bookings={recentBookings} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kuukauden tulot</h2>
            <IncomeChart bookings={monthlyBookings} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Odottavat arvostelut</h2>
            <PendingReviews reviews={pendingReviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
