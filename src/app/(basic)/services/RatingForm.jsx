"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Swal from "sweetalert2";

export default function RatingForm({ onSubmit }) {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());
    formObj.rating = rating;
    if (!rating) {
      Swal.fire({
        icon: "info",
        title: "Please select rating",
      });
    }
    onSubmit?.(formObj);
    setRating(0);
    form.reset();
  };

  return (
    <div className="sticky top-16  w-full max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Rate Your Experience
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We value your feedback!
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => {
            const index = i + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={36}
                  className={`${
                    index <= (hover || rating)
                      ? "fill-primary text-primary"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div>
          <select
            name="status"
            required
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <textarea
          placeholder="Write your feedback..."
          name="feedback"
          className="w-full h-28 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        />

        <button type="submit"
          className="cursor-pointer w-full py-2.5 font-medium rounded-lg bg-primary text-white hover:bg-primary/70 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
