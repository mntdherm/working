import type { Review } from "~/types/vendor";

interface ReviewsProps {
  reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Arvostelut</h2>
      </div>
      <div className="border-t border-gray-200">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {review.author}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString("fi-FI")}
                  </span>
                </div>
                <div className="mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      } text-sm`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
