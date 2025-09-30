"use client";
import React, { useState } from 'react';
import { Star, ThumbsUp, X, CheckCircle } from 'lucide-react';

// Reusable Star Renderer Component for consistency
const StarRating = ({ rating, size = 'w-5 h-5', color = 'text-yellow-500' }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          // Added fill-yellow-500 for a consistent look
          className={`${size} ${star <= rating ? `${color} fill-yellow-500` : 'text-gray-300'} transition-colors duration-200`}
        />
      ))}
    </div>
  );
};

const ReviewsComponent = () => {
  // Sample reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      mechanic: {
        id: 101,
        name: "Arif Hossain",
        specialty: "Engine Repair",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      service: "Oil Change",
      vehicle: "Toyota Corolla 2018",
      rating: 5,
      comment: "Excellent service! Arif was very professional and completed the work faster than expected. Highly recommend!",
      date: "2024-10-15",
      user: "Rahim Khan",
      userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      mechanic: {
        id: 102,
        name: "Sajid Alam",
        specialty: "Electrical Systems",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      service: "Electrical System Check",
      vehicle: "Honda Civic 2020",
      rating: 4,
      comment: "Good service overall. Sajid identified the electrical issue quickly but the repair took a bit longer than estimated.",
      date: "2024-10-10",
      user: "Rahim Khan",
      userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      mechanic: {
        id: 103,
        name: "Tanvir Rahman",
        specialty: "Body Work",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80"
      },
      service: "Dent Removal",
      vehicle: "Toyota Corolla 2018",
      rating: 3,
      comment: "Average job. The dent is mostly gone but you can still see it if you look closely. Price was reasonable though.",
      date: "2024-10-05",
      user: "Rahim Khan",
      userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      helpful: 4,
      verified: true
    }
  ]);

  // Sample data for review form
  const mechanics = [
    { id: 101, name: "Arif Hossain", specialty: "Engine Repair" },
    { id: 102, name: "Sajid Alam", specialty: "Electrical Systems" },
    { id: 103, name: "Tanvir Rahman", specialty: "Body Work" },
    { id: 104, name: "Nadia Ahmed", specialty: "AC Repair" }
  ];

  const services = [
    "Oil Change", "Brake Service", "Engine Diagnostic",
    "Electrical System Check", "AC Service", "Tire Rotation",
    "Dent Removal", "Paint Job", "Battery Replacement"
  ];

  const vehicles = [
    { id: 1, make: "Toyota", model: "Corolla", year: "2018", plate: "DHA-1234" },
    { id: 2, make: "Honda", model: "Civic", year: "2020", plate: "DHA-5678" }
  ];

  // Review form state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    mechanicId: "",
    service: "",
    vehicleId: "",
    rating: 0,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Handle input changes in review form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  // Handle rating selection
  const handleRatingSelect = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  // Submit a new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find selected mechanic and vehicle
    const selectedMechanic = mechanics.find(m => m.id === parseInt(newReview.mechanicId));
    const selectedVehicle = vehicles.find(v => v.id === parseInt(newReview.vehicleId));

    // Create new review object
    const review = {
      id: reviews.length + 1,
      mechanic: {
        id: selectedMechanic.id,
        name: selectedMechanic.name,
        specialty: selectedMechanic.specialty,
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80&id=${selectedMechanic.id}`
      },
      service: newReview.service,
      vehicle: `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}`,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      user: "Rahim Khan",
      userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      helpful: 0,
      verified: true
    };

    // Add to reviews list and reset
    setReviews(prev => [review, ...prev]);
    setNewReview({ mechanicId: "", service: "", vehicleId: "", rating: 0, comment: "" });
    setIsWritingReview(false);
    setIsSubmitting(false);
  };

  // Mark a review as helpful
  const handleHelpful = (id) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === id
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filter === "all") return true;
      return review.rating === parseInt(filter);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  // Calculate average rating
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Count ratings
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating]++;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="container mx-auto"> {/* Applied container and centered */}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Service Reviews</h1>
          <p className="text-gray-500">View and manage your service reviews for all completed bookings.</p>
        </div>

        {/* Stats and Action Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

            {/* Rating Breakdown */}
            <div className="flex items-center mb-6 md:mb-0">
              <div className="mr-8 flex flex-col items-center">
                <div className="text-6xl font-extrabold text-orange-600">{averageRating}</div>
                <div className="mt-2"><StarRating rating={Number(averageRating)} size="w-6 h-6" /></div>
                <div className="text-sm text-gray-500 mt-2 font-medium">{totalReviews} total reviews</div>
              </div>

              <div className="space-y-1 w-full max-w-xs">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <div className="text-sm font-medium text-gray-700">{rating} star</div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mx-3">
                      <div
                        className="h-2 bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(ratingCounts[rating] / totalReviews) * 100 || 0}%` }}
                        aria-label={`${ratingCounts[rating]} reviews for ${rating} stars`}
                      ></div>
                    </div>
                    <div className="w-8 text-sm text-gray-600 font-medium">{ratingCounts[rating]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsWritingReview(true)}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "all" ? "bg-orange-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(rating.toString())}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors ${filter === rating.toString() ? "bg-orange-100 text-orange-700 ring-2 ring-orange-400/50" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <span className="mr-1">{rating}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </button>
            ))}
          </div>

          <div className="flex items-center">
            <label htmlFor="sort-by" className="text-sm text-gray-600 mr-2 font-medium">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-xl px-4 py-2 focus:ring-orange-500 focus:border-orange-500 transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map(review => (
              <div key={review.id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col md:flex-row">

                  {/* Mechanic Info (Left Column) */}
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 md:w-56">
                    <div className="flex items-center">
                      <img
                        src={review.mechanic.avatar}
                        alt={review.mechanic.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-200"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{review.mechanic.name}</h3>
                        <p className="text-sm text-gray-500">{review.mechanic.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Content (Right Column) */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center">
                          <StarRating rating={review.rating} />
                          <span className="ml-3 text-sm text-gray-500">{review.date}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 mt-2 text-lg">{review.service}</h4>
                        <p className="text-sm text-gray-500">{review.vehicle}</p>
                      </div>

                      <div className="flex items-center mt-3 sm:mt-0">
                        {review.verified && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mr-3 shadow-inner">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified Booking
                          </span>
                        )}
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="text-sm text-gray-600 hover:text-orange-600 flex items-center transition-colors"
                          aria-label={`Mark review as helpful. Currently ${review.helpful} helpful votes.`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-700 italic border-l-2 border-orange-300 pl-3 py-1">{review.comment}</p>

                    <div className="flex items-center mt-4 pt-3 border-t border-gray-100">
                      <img
                        src={review.userAvatar}
                        alt={review.user}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">{review.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100">
              <Star className="w-8 h-8 text-orange-400 mx-auto mb-4" />
              <h3 className="font-medium text-xl mb-2 text-gray-800">No Reviews to Show</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't written any reviews matching this filter yet.</p>
              <button
                onClick={() => setIsWritingReview(true)}
                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition shadow-md"
              >
                Write Your First Review
              </button>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {isWritingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
              <div className="p-8">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close review form"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="space-y-5">

                    {/* Mechanic Selection */}
                    <div>
                      <label htmlFor="mechanicId" className="block text-sm font-medium text-gray-700 mb-1">Mechanic</label>
                      <select
                        id="mechanicId"
                        name="mechanicId"
                        value={newReview.mechanicId}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      >
                        <option value="">Select a mechanic</option>
                        {mechanics.map(mechanic => (
                          <option key={mechanic.id} value={mechanic.id}>
                            {mechanic.name} - {mechanic.specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Service & Vehicle Selection */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <select
                          id="service"
                          name="service"
                          value={newReview.service}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="">Select service</option>
                          {services.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                        <select
                          id="vehicleId"
                          name="vehicleId"
                          value={newReview.vehicleId}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        >
                          <option value="">Select vehicle</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.make} {vehicle.model}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingSelect(star)}
                            className="focus:outline-none transition-transform transform hover:scale-110"
                            aria-label={`${star} stars`}
                          >
                            <Star
                              className={`w-9 h-9 ${star <= newReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-current'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={newReview.comment}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Share your experience with this mechanic..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || newReview.rating === 0}
                      className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsComponent;