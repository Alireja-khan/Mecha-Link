"use client";
import React, { useState } from 'react';

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

  // Sample mechanics for review form
  const mechanics = [
    { id: 101, name: "Arif Hossain", specialty: "Engine Repair" },
    { id: 102, name: "Sajid Alam", specialty: "Electrical Systems" },
    { id: 103, name: "Tanvir Rahman", specialty: "Body Work" },
    { id: 104, name: "Nadia Ahmed", specialty: "AC Repair" }
  ];

  // Sample services for review form
  const services = [
    "Oil Change", "Brake Service", "Engine Diagnostic", 
    "Electrical System Check", "AC Service", "Tire Rotation",
    "Dent Removal", "Paint Job", "Battery Replacement"
  ];

  // User's vehicles
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
  const [filter, setFilter] = useState("all"); // all, 5-star, 4-star, etc.
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest

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
    
    // Add to reviews list
    setReviews(prev => [review, ...prev]);
    
    // Reset form
    setNewReview({
      mechanicId: "",
      service: "",
      vehicleId: "",
      rating: 0,
      comment: ""
    });
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
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Count ratings
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingCounts[review.rating]++;
  });

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold ">My Reviews</h1>
          <p className="">View and manage your service reviews</p>
        </div>

        {/* Stats and Action Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-6">
                <div className="text-4xl font-bold ">{averageRating}</div>
                <div className="flex mt-1">{renderStars(Number(averageRating))}</div>
                <div className="text-sm  mt-1">{reviews.length} reviews</div>
              </div>
              
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center">
                    <div className="w-8 text-sm ">{rating} star</div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mx-2">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full" 
                        style={{ width: `${(ratingCounts[rating] / reviews.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm ">{ratingCounts[rating]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setIsWritingReview(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${filter === "all" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setFilter(rating.toString())}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${filter === rating.toString() ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
              >
                <span className="mr-1">{rating}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <label className="text-sm  mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1 focus:ring-indigo-500 focus:border-indigo-500"
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
              <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="flex items-center">
                      <img
                        src={review.mechanic.avatar}
                        alt={review.mechanic.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium">{review.mechanic.name}</h3>
                        <p className="text-sm ">{review.mechanic.specialty}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm ">{review.date}</span>
                        </div>
                        <h4 className="font-medium mt-2">{review.service}</h4>
                        <p className="text-sm ">{review.vehicle}</p>
                      </div>
                      
                      <div className="flex items-center mt-3 sm:mt-0">
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mr-2">
                            Verified
                          </span>
                        )}
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="text-sm  hover:text-indigo-600 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                    
                    <p className="mt-4 text-gray-700">{review.comment}</p>
                    
                    <div className="flex items-center mt-4">
                      <img
                        src={review.userAvatar}
                        alt={review.user}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm ">{review.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">🌟</div>
              <h3 className="font-medium  mb-2">No reviews yet</h3>
              <p className=" mb-4">You haven't written any reviews for your services.</p>
              <button
                onClick={() => setIsWritingReview(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Write Your First Review
              </button>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {isWritingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Write a Review</h2>
                  <button
                    onClick={() => setIsWritingReview(false)}
                    className="text-gray-400 hover:"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmitReview}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mechanic</label>
                      <select
                        name="mechanicId"
                        value={newReview.mechanicId}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a mechanic</option>
                        {mechanics.map(mechanic => (
                          <option key={mechanic.id} value={mechanic.id}>
                            {mechanic.name} - {mechanic.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                      <select
                        name="service"
                        value={newReview.service}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                      <select
                        name="vehicleId"
                        value={newReview.vehicleId}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingSelect(star)}
                            className="focus:outline-none"
                          >
                            <svg
                              className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                      <textarea
                        name="comment"
                        value={newReview.comment}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Share your experience with this mechanic..."
                        className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsWritingReview(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || newReview.rating === 0}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
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