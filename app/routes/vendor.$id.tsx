import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import type { VendorProfile } from "~/types/vendor";

import BusinessInfo from "~/components/vendor/BusinessInfo";
import ServicesList from "~/components/vendor/ServicesList";
import OperatingHours from "~/components/vendor/OperatingHours";
import Reviews from "~/components/vendor/Reviews";

export const loader: LoaderFunction = async ({ params }) => {
  // TODO: Fetch actual vendor data from your database
  const mockVendor: VendorProfile = {
    id: params.id!,
    businessName: "Autopesula Oy",
    logo: "https://placeholder.com/logo.jpg",
    coverPhoto: "https://placeholder.com/cover.jpg",
    description: "Laadukasta autopesua jo vuodesta 2010.",
    address: "Pesukatu 123, 00100 Helsinki",
    phone: "+358 50 123 4567",
    email: "info@autopesula.fi",
    averageRating: 4.5,
    services: [
      {
        id: "1",
        name: "Peruspesu",
        description: "Auton ulkopesu ja kuivaus",
        price: 25,
        duration: 30,
      },
      // Add more services...
    ],
    operatingHours: [
      {
        day: "Maanantai",
        open: "08:00",
        close: "18:00",
        isClosed: false,
      },
      // Add more operating hours...
    ],
    reviews: [
      {
        id: "1",
        author: "Matti Meikäläinen",
        rating: 5,
        comment: "Erinomaista palvelua!",
        date: "2023-08-01",
      },
      // Add more reviews...
    ],
  };

  return json({ vendor: mockVendor });
};

export default function VendorProfile() {
  const { vendor } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <BusinessInfo vendor={vendor} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ServicesList services={vendor.services} />
            <Reviews reviews={vendor.reviews} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <OperatingHours hours={vendor.operatingHours} />
            
            {/* Booking Button */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <button
                type="button"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Varaa aika
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
