"use client";
import React, { useState } from "react";

const BookingComponent = ({ onBookingComplete }) => {
  // Available mechanics data (would typically come from API)
  const availableMechanics = [
    { id: 1, name: "Arif Hossain", specialty: "Engine Repair", rating: 4.8, hourlyRate: 45, available: true },
    { id: 2, name: "Sajid Alam", specialty: "Electrical Systems", rating: 4.6, hourlyRate: 40, available: true },
    { id: 3, name: "Tanvir Rahman", specialty: "Body Work", rating: 4.9, hourlyRate: 50, available: true },
    { id: 4, name: "Nadia Ahmed", specialty: "AC Repair", rating: 4.7, hourlyRate: 42, available: false },
  ];

  // Available services
  const availableServices = [
    { id: 1, name: "Oil Change", basePrice: 30, duration: 30 },
    { id: 2, name: "Brake Service", basePrice: 80, duration: 60 },
    { id: 3, name: "Engine Diagnostic", basePrice: 50, duration: 45 },
    { id: 4, name: "Electrical System Check", basePrice: 60, duration: 60 },
    { id: 5, name: "AC Service", basePrice: 70, duration: 90 },
    { id: 6, name: "Tire Rotation", basePrice: 25, duration: 30 },
  ];

  // User's vehicles
  const userVehicles = [
    { id: 1, make: "Toyota", model: "Corolla", year: "2018", plate: "DHA-1234" },
    { id: 2, make: "Honda", model: "Civic", year: "2020", plate: "DHA-5678" },
  ];

  // Booking steps
  const steps = ["Service", "Vehicle", "Mechanic", "Schedule", "Review", "Payment"];

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedMechanic(null); // Reset mechanic when service changes
    setCurrentStep(1); // Move to vehicle selection
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentStep(2); // Move to mechanic selection
  };

  // Handle mechanic selection
  const handleMechanicSelect = (mechanic) => {
    setSelectedMechanic(mechanic);
    setCurrentStep(3); // Move to scheduling
  };

  // Handle date and time selection
  const handleDateTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep(4); // Move to review
  };

  // Handle booking submission
  const handleBookingSubmit = async () => {
    setIsProcessing(true);
    setBookingError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create booking object
      const booking = {
        id: Math.floor(Math.random() * 10000),
        service: selectedService,
        vehicle: selectedVehicle,
        mechanic: selectedMechanic,
        date: selectedDate,
        time: selectedTime,
        notes: additionalNotes,
        status: "Confirmed",
        total: selectedService.basePrice + (selectedMechanic.hourlyRate * (selectedService.duration / 60)),
        createdAt: new Date().toISOString()
      };
      
      // Call parent callback if provided
      if (onBookingComplete) {
        onBookingComplete(booking);
      }
      
      setCurrentStep(5); // Move to confirmation
    } catch (error) {
      setBookingError("Failed to process booking. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate total cost
  const calculateTotal = () => {
    if (!selectedService || !selectedMechanic) return 0;
    return selectedService.basePrice + (selectedMechanic.hourlyRate * (selectedService.duration / 60));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Service selection
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableServices.map(service => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedService?.id === service.id 
                    ? "border-indigo-500 bg-indigo-50" 
                    : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-gray-600">${service.basePrice} • {service.duration} mins</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 1: // Vehicle selection
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select Your Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id 
                    ? "border-indigo-500 bg-indigo-50" 
                    : "border-gray-200 hover:border-indigo-300"
                  }`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <h4 className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
                  <p className="text-sm text-gray-600">Plate: {vehicle.plate}</p>
                </div>
              ))}
              <div 
                className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => console.log("Add new vehicle")}
              >
                <span className="text-2xl">+</span>
                <p className="text-sm mt-2">Add New Vehicle</p>
              </div>
            </div>
          </div>
        );
      
      case 2: // Mechanic selection
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose a Mechanic</h3>
            <p className="text-sm text-gray-600">Recommended mechanics for {selectedService.name}</p>
            
            <div className="grid grid-cols-1 gap-4">
              {availableMechanics
                .filter(mechanic => mechanic.available)
                .map(mechanic => (
                  <div
                    key={mechanic.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMechanic?.id === mechanic.id 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => handleMechanicSelect(mechanic)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{mechanic.name}</h4>
                        <p className="text-sm text-gray-600">Specialty: {mechanic.specialty}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm ml-1">{mechanic.rating}</span>
                          <span className="text-sm text-gray-600 ml-2">${mechanic.hourlyRate}/hr</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${(selectedService.basePrice + (mechanic.hourlyRate * (selectedService.duration / 60))).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600">Total estimate</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      
      case 3: // Scheduling
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(tomorrow.getDate() + i);
          nextWeek.push(date.toISOString().split('T')[0]);
        }
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select Date & Time</h3>
            
            <div className="mb-6">
              <h4 className="font-medium mb-3">Available Dates</h4>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {nextWeek.map(date => (
                  <div
                    key={date}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                      selectedDate === date 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-gray-200 hover:border-indigo-300"
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-sm font-medium">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-xs">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedDate && (
              <div>
                <h4 className="font-medium mb-3">Available Time Slots</h4>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      className={`p-2 border rounded-lg text-center cursor-pointer transition-all ${
                        selectedTime === time 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => handleDateTimeSelect(selectedDate, time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 4: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review Your Booking</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Service Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Service</p>
                  <p className="font-medium">{selectedService.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vehicle</p>
                  <p className="font-medium">
                    {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Mechanic</p>
                  <p className="font-medium">{selectedMechanic.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Scheduled</p>
                  <p className="font-medium">
                    {formatDate(selectedDate)} at {selectedTime}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Cost Breakdown</h4>
              <div className="border rounded-lg divide-y">
                <div className="p-3 flex justify-between">
                  <span>Service fee</span>
                  <span>${selectedService.basePrice.toFixed(2)}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Labor ({selectedService.duration} mins @ ${selectedMechanic.hourlyRate}/hr)</span>
                  <span>${(selectedMechanic.hourlyRate * (selectedService.duration / 60)).toFixed(2)}</span>
                </div>
                <div className="p-3 flex justify-between font-medium border-t">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Additional Notes (Optional)</h4>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Any specific issues or instructions for the mechanic..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
            
            {bookingError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {bookingError}
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentStep(3)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleBookingSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        );
      
      case 5: // Confirmation
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-medium mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your {selectedService.name} for your {selectedVehicle.make} {selectedVehicle.model} has been scheduled with {selectedMechanic.name}.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto mb-6">
              <p className="font-medium">Booking Reference: #{Math.floor(Math.random() * 10000)}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedDate)} at {selectedTime}
              </p>
            </div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => window.location.reload()} // Or navigate to dashboard
            >
              Return to Dashboard
            </button>
          </div>
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between relative">
          {/* Progress line */}
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-3 left-0 h-0.5 bg-indigo-600 -z-10 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Step indicators */}
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                index <= currentStep 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 text-gray-500"
              }`}>
                {index < currentStep ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className={`text-xs mt-2 ${index <= currentStep ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default BookingComponent;