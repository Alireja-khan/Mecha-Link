"use client";
import React, { useState } from 'react';
import { Star, ThumbsUp, X, CheckCircle } from 'lucide-react';

// Reusable Star Renderer Component for consistency (unchanged)
const StarRating = ({ rating, size = 'w-5 h-5', color = 'text-warning' }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          // Use text-warning for color and fill-warning for fill (DaisyUI equivalent of yellow)
          className={`${size} ${star <= rating ? `${color} fill-warning` : 'text-base-300'} transition-colors duration-200`}
        />
      ))}
    </div>
  );
};

const ReviewsComponent = () => {
  // Sample reviews data (unchanged)
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

  // Sample data for review form (unchanged)
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

  // Review form state (unchanged)
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

  // Handlers (unchanged)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingSelect = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

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

  const handleHelpful = (id) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === id
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  // Filter and sort reviews (unchanged)
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

  // Calculate average rating (unchanged)
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;

  // Count ratings (unchanged)
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating]++;
  });

  return (
    // Updated background to base-200 for page
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 md:p-10 text-base-content"> {/* Adjusted padding for small screens */}
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">My Service Reviews</h1> {/* Adjusted text size */}
          <p className="text-neutral-content text-sm sm:text-base">View and manage your service reviews for all completed bookings.</p>
        </div>

        {/* Stats and Action Card */}
        <div className="bg-base-100 rounded-3xl shadow-xl p-6 sm:p-8 mb-8 border border-neutral"> {/* Adjusted padding */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

            {/* Rating Breakdown */}
            {/* On small screens, the breakdown will stack vertically with the button below it */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 md:mb-0 w-full md:w-auto">
              {/* Average Rating Block */}
              <div className="mr-0 sm:mr-8 mb-4 sm:mb-0 flex flex-col items-center flex-shrink-0">
                <div className="text-5xl sm:text-6xl font-extrabold text-primary">{averageRating}</div> {/* Adjusted text size */}
                <div className="mt-2"><StarRating rating={Number(averageRating)} size="w-6 h-6" color="text-warning" /></div>
                <div className="text-sm text-neutral-content mt-2 font-medium">{totalReviews} total reviews</div>
              </div>

              {/* Individual Star Count Bars */}
              <div className="space-y-1 w-full max-w-sm sm:max-w-xs"> {/* Ensuring max width on small screen doesn't get too large */}
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <div className="text-sm font-medium text-base-content w-10 flex-shrink-0">{rating} star</div> {/* Fixed width for 'star' text */}
                    <div className="w-full h-2 bg-base-300 rounded-full mx-3"> {/* w-full ensures it takes available space */}
                      <div
                        className="h-2 bg-warning rounded-full transition-all duration-500"
                        style={{ width: `${(ratingCounts[rating] / totalReviews) * 100 || 0}%` }}
                        aria-label={`${ratingCounts[rating]} reviews for ${rating} stars`}
                      ></div>
                    </div>
                    <div className="w-8 text-sm text-neutral-content font-medium flex-shrink-0">{ratingCounts[rating]}</div> {/* Fixed width for count */}
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button - takes full width on small screen, and auto on md+ */}
            <button
              onClick={() => setIsWritingReview(true)}
              className="w-full md:w-auto px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary/90 transition duration-200 shadow-md hover:shadow-lg"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 p-4 bg-base-100 rounded-2xl shadow-sm border border-neutral">
          {/* Filter Buttons: Use flex-wrap and gap for good flow on small screens. Use a grid on larger mobile screens for better density. */}
          <div className="flex flex-wrap gap-2 mb-4 lg:mb-0 w-full sm:w-auto">
            {/* All Reviews Button */}
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-content shadow-md" : "bg-base-300 text-base-content hover:bg-base-300/80"}`}
            >
              All Reviews
            </button>
            {/* Star Filter Buttons */}
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(rating.toString())}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center transition-colors 
                ${filter === rating.toString()
                    ? "bg-primary/20 text-primary ring-2 ring-primary/50"
                    : "bg-base-300 text-base-content hover:bg-base-300/80"
                  }`}
              >
                <span className="mr-1">{rating}</span>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-warning fill-warning" /> {/* Adjusted star size */}
              </button>
            ))}
          </div>

          <div className="flex items-center w-full lg:w-auto"> {/* Ensure sort takes full width if needed */}
            <label htmlFor="sort-by" className="text-sm text-neutral-content mr-2 font-medium flex-shrink-0">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-auto text-sm border border-neutral rounded-xl px-4 py-2 focus:ring-primary focus:border-primary transition-colors cursor-pointer bg-base-100 text-base-content"
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
              <div key={review.id} className="bg-base-100 rounded-3xl shadow-lg p-6 border border-neutral transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col sm:flex-row"> {/* Changed md to sm for better stacking on small phones */}

                  {/* Mechanic Info (Left Column) */}
                  {/* On small screens, this is full-width (flex-shrink-0 mb-4) */}
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 sm:w-44 md:w-56"> {/* Reduced width for medium screens for better content fit */}
                    <div className="flex items-center">
                      <img
                        src={review.mechanic.avatar}
                        alt={review.mechanic.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-primary/50"
                      />
                      <div className="ml-3">
                        <h3 className="font-semibold text-base-content text-sm sm:text-base">{review.mechanic.name}</h3>
                        <p className="text-xs sm:text-sm text-neutral-content">{review.mechanic.specialty}</p>
                      </div>
                    </div>
                  </div>

                  {/* Review Content (Right Column) */}
                  <div className="flex-1 min-w-0"> {/* min-w-0 is crucial for flex items to shrink in tight spaces */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-neutral pb-3">
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center">
                          <StarRating rating={review.rating} size="w-4 h-4 sm:w-5 sm:h-5" /> {/* Adjusted star size */}
                          <span className="ml-3 text-xs sm:text-sm text-neutral-content">{review.date}</span>
                        </div>
                        <h4 className="font-bold text-base-content mt-2 text-base sm:text-lg">{review.service}</h4> {/* Adjusted text size */}
                        <p className="text-xs sm:text-sm text-neutral-content">{review.vehicle}</p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0"> {/* Stack badge/button vertically on small screen */}
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-success/20 text-success text-xs font-medium rounded-full mb-2 sm:mb-0 sm:mr-3 shadow-inner">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </span>
                        )}
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="text-neutral-content hover:text-primary flex items-center transition-colors text-sm mt-1 sm:mt-0"
                          aria-label={`Mark review as helpful. Currently ${review.helpful} helpful votes.`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-base-content italic border-l-2 border-primary/50 pl-3 py-1 text-sm">{review.comment}</p> {/* Adjusted text size */}

                    <div className="flex items-center mt-4 pt-3 border-t border-neutral">
                      <img
                        src={review.userAvatar}
                        alt={review.user}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-neutral"
                      />
                      <span className="ml-2 text-xs sm:text-sm font-medium text-base-content">{review.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No Reviews Card
            <div className="bg-base-100 rounded-3xl shadow-lg p-6 sm:p-10 text-center border border-neutral">
              <Star className="w-8 h-8 text-warning mx-auto mb-4" />
              <h3 className="font-medium text-xl mb-2 text-base-content">No Reviews to Show</h3>
              <p className="text-neutral-content mb-6">Looks like you haven't written any reviews matching this filter yet.</p>
              <button
                onClick={() => setIsWritingReview(true)}
                className="px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary/90 transition shadow-md"
              >
                Write Your First Review
              </button>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {isWritingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-base-100 rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all duration-300"> {/* Increased max-h on small screens */}
              <div className="p-5 sm:p-8"> {/* Adjusted padding */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-neutral">
                  <h2 className="text-xl sm:text-2xl font-bold text-base-content">Share Your Experience</h2> {/* Adjusted text size */}
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-neutral-content hover:text-base-content transition-colors p-1 rounded-full hover:bg-base-200"
                    aria-label="Close review form"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="space-y-5">

                    {/* Mechanic Selection (unchanged, good) */}
                    <div>
                      <label htmlFor="mechanicId" className="block text-sm font-medium text-base-content mb-1">Mechanic</label>
                      <select
                        id="mechanicId"
                        name="mechanicId"
                        value={newReview.mechanicId}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-neutral rounded-xl focus:ring-primary focus:border-primary transition-colors bg-base-100 text-base-content"
                      >
                        <option value="">Select a mechanic</option>
                        {mechanics.map(mechanic => (
                          <option key={mechanic.id} value={mechanic.id}>
                            {mechanic.name} - {mechanic.specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Service & Vehicle Selection - Stack vertically on extra small screens */}
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <label htmlFor="service" className="block text-sm font-medium text-base-content mb-1">Service</label>
                        <select
                          id="service"
                          name="service"
                          value={newReview.service}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-neutral rounded-xl focus:ring-primary focus:border-primary transition-colors bg-base-100 text-base-content"
                        >
                          <option value="">Select service</option>
                          {services.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label htmlFor="vehicleId" className="block text-sm font-medium text-base-content mb-1">Vehicle</label>
                        <select
                          id="vehicleId"
                          name="vehicleId"
                          value={newReview.vehicleId}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-neutral rounded-xl focus:ring-primary focus:border-primary transition-colors bg-base-100 text-base-content"
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
                      <label className="block text-sm font-medium text-base-content mb-2">Your Rating</label>
                      {/* Ensure buttons don't wrap oddly */}
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
                              className={`w-8 h-8 sm:w-9 sm:h-9 ${star <= newReview.rating ? 'text-warning fill-warning' : 'text-base-300 fill-current'}`}
                            /> {/* Adjusted star size */}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment (unchanged, good) */}
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-base-content mb-1">Your Review</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={newReview.comment}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Share your experience with this mechanic..."
                        className="w-full p-3 border border-neutral rounded-xl focus:ring-primary focus:border-primary transition-colors bg-base-100 text-base-content"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-4 py-3 sm:px-6 sm:py-3 border border-neutral rounded-xl text-base-content hover:bg-base-200 transition-colors shadow-sm text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || newReview.rating === 0}
                      className="px-4 py-3 sm:px-6 sm:py-3 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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