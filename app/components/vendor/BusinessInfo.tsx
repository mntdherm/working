import type { VendorProfile } from "~/types/vendor";

interface BusinessInfoProps {
  vendor: VendorProfile;
}

export default function BusinessInfo({ vendor }: BusinessInfoProps) {
  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-64 w-full overflow-hidden">
        <img
          src={vendor.coverPhoto}
          alt={vendor.businessName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Business Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={vendor.logo}
                  alt={`${vendor.businessName} logo`}
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              
              {/* Business Details */}
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {vendor.businessName}
                </h1>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{vendor.address}</p>
                  <p className="mt-1">{vendor.phone}</p>
                  <p>{vendor.email}</p>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  {vendor.averageRating.toFixed(1)}
                </span>
                <div className="ml-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${
                        i < Math.floor(vendor.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } inline-block`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-gray-600">{vendor.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
