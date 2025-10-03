"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function RatingForm({ onSubmit }) {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());
    formObj.rating = rating;
    
    if (!rating) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    onSubmit?.(formObj);
    setRating(0);
    form.reset();
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-primary shadow-sm p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold mb-1">
          Share Your Experience
        </h3>
        <p className="text-sm text-gray-400">
          Help others with your feedback
        </p>
      </div>

      {/* Alert Message */}
      {showAlert && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 animate-pulse">
          Please select a rating to continue
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3 text-center">
            Rate your experience
          </label>
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
                    size={32}
                    className={`${
                      index <= (hover || rating)
                        ? "fill-orange-500 text-orange-500"
                        : "text-primary"
                    } transition-colors duration-200`}
                  />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-400 mt-2">
              You rated: {rating} star{rating > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Service Status
          </label>
          <select
            name="status"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-primary focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          >
            <option value="in-progress">In Progress</option>
            <option className="text-black" value="completed">Completed</option>
            <option className="text-black" value="rejected">Rejected</option>
          </select>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Your Feedback
          </label>
          <textarea
            placeholder="Tell us about your experience..."
            name="feedback"
            rows="4"
            className="w-full px-4 py-3 rounded-lg border border-primary placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Send className="w-4 h-4" />
          Submit Review
        </button>
      </form>
    </div>
  );
}