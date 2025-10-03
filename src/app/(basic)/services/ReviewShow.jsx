import { Star, User } from "lucide-react";

export default function ReviewShow({ reviews = [] }) {
  if (reviews?.length === 0) {
    return (
      <div className="rounded-2xl border border-primary shadow-sm p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-gray-400">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 rounded-2xl border border-primary shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <span className="text-sm text-gray-400">{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div 
            key={index} 
            className="rounded-xl p-5 border border-primary hover:border-orange-200 transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-12 h-12 flex-shrink-0">
                  {review?.userPhoto ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                      src={review.userPhoto}
                      alt={review.userName || "User"}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center ring-2 ring-white">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">
                    {review.userName || "Anonymous"}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      review.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : review.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating and Date */}
              <div className="text-right flex-shrink-0">
                <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-sm font-semibold mb-1">
                  <Star className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{review.rating}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Feedback */}
            {review.feedback && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {review.feedback}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
