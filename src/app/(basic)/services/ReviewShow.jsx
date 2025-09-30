import { Star } from "lucide-react";
import React from "react";

export default function ReviewShow({ reviews = [] }) {
  console.log(reviews);
  return (
    <div className="space-y-5">
      {reviews?.length === 0 && (
        <div className="bg-gray-100 p-5 rounded-xl">
          <p className="text-center">No Reviews Found</p>
        </div>
      )}
      {reviews?.map((review, index) => (
        <div key={index} className=" bg-gray-100 p-5 rounded-xl">
          <div className="flex justify-between gap-5">
            <div className="flex items-center gap-5">
              <img
                className="w-20 h-20 shrink-0 rounded-full object-cover"
                src={review.image || "https://i.ibb.co.com/990my6Yq/avater.png"}
                alt={review.userName}
              />
              <div>
                <h4>{review.userName}</h4>
                <p>{review.status}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>{review.rating}</span>
              </div>
              
              <p>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <p className="mt-5">{review.feedback}</p>
        </div>
      ))}
    </div>
  );
}
