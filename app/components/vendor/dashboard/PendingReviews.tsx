import { format } from 'date-fns';
import { fi } from 'date-fns/locale';

interface PendingReview {
  id: string;
  created_at: string;
  customer: {
    name: string;
  };
  total_price: number;
}

interface PendingReviewsProps {
  reviews: PendingReview[];
}

export function PendingReviews({ reviews }: PendingReviewsProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">Ei odottavia arvosteluja</p>
    );
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {reviews.map((review) => (
          <li key={review.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {review.customer.name}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(review.created_at), 'dd.MM.yyyy', { locale: fi })}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Lähetä muistutus
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
