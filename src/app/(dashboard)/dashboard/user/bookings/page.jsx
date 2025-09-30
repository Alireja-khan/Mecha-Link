"use client";
import React, { useState, forwardRef, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Plus, Calendar, Clock, DollarSign, CheckCircle, Car, Settings, UserCheck, Star } from 'lucide-react';

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
    { id: 1, name: "Oil Change", basePrice: 30, duration: 30, icon: Settings },
    { id: 2, name: "Brake Service", basePrice: 80, duration: 60, icon: DollarSign },
    { id: 3, name: "Engine Diagnostic", basePrice: 50, duration: 45, icon: Car },
    { id: 4, name: "Electrical Check", basePrice: 60, duration: 60, icon: Car },
    { id: 5, name: "AC Service", basePrice: 70, duration: 90, icon: Car },
    { id: 6, name: "Tire Rotation", basePrice: 25, duration: 30, icon: Car },
  ];

  // User's vehicles
  const userVehicles = [
    { id: 1, make: "Toyota", model: "Corolla", year: "2018", plate: "DHA-1234" },
    { id: 2, make: "Honda", model: "Civic", year: "2020", plate: "DHA-5678" },
  ];

  // Booking steps
  const steps = ["Service", "Vehicle", "Mechanic", "Schedule", "Review"];

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  // --- Utility Functions ---

  const calculateTotal = () => {
    if (!selectedService || !selectedMechanic) return 0;
    return selectedService.basePrice + (selectedMechanic.hourlyRate * (selectedService.duration / 60));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getNextWeekDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      // Start from tomorrow
      date.setDate(date.getDate() + 1 + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // --- Navigation Handlers ---

  const handleNext = () => {
    setBookingError("");
    let canProceed = false;

    switch (currentStep) {
      case 0: // Service
        canProceed = !!selectedService;
        if (!canProceed) setBookingError("Please select a service to continue.");
        break;
      case 1: // Vehicle
        canProceed = !!selectedVehicle;
        if (!canProceed) setBookingError("Please select a vehicle to continue.");
        break;
      case 2: // Mechanic
        canProceed = !!selectedMechanic;
        if (!canProceed) setBookingError("Please select a mechanic to continue.");
        break;
      case 3: // Schedule
        canProceed = !!selectedDate && !!selectedTime;
        if (!canProceed) setBookingError("Please select both a date and a time slot.");
        break;
      case 4: // Review/Payment (handled by handleBookingSubmit)
        return handleBookingSubmit();
      default:
        canProceed = true;
    }

    if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setBookingError("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = async () => {
    setIsProcessing(true);
    setBookingError("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const booking = {
        id: Math.floor(Math.random() * 10000),
        service: selectedService,
        vehicle: selectedVehicle,
        mechanic: selectedMechanic,
        date: selectedDate,
        time: selectedTime,
        notes: additionalNotes,
        status: "Confirmed",
        total: calculateTotal(),
        createdAt: new Date().toISOString()
      };

      if (onBookingComplete) {
        onBookingComplete(booking);
      }

      setCurrentStep(5); // Move to confirmation (Step 5 is outside the main step array)
    } catch (error) {
      setBookingError("Failed to process booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  // --- Render Step Content ---

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Service selection
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">1. Select a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {availableServices.map(service => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className={`p-5 border border-gray-200 rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center gap-4 ${selectedService?.id === service.id
                      ? "border-orange-600 ring-4 ring-orange-100 bg-orange-50"
                      : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg"
                      }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <Icon className="w-6 h-6 text-orange-600 shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">${service.basePrice} base • {service.duration} mins</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 1: // Vehicle selection
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">2. Select Your Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {userVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`p-5 border border-gray-200 rounded-xl shadow-md cursor-pointer transition-all duration-200 ${selectedVehicle?.id === vehicle.id
                    ? "border-orange-600 ring-4 ring-orange-100 bg-orange-50"
                    : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg"
                    }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <Car className="w-5 h-5 text-orange-600 mb-2" />
                  <h4 className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.plate}</p>
                </div>
              ))}
              <div
                className="p-5 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all shadow-md"
                onClick={() => console.log("Add new vehicle")}
              >
                <Plus className="w-6 h-6 text-gray-500" />
                <p className="text-sm mt-2 font-medium text-gray-600">Add New Vehicle</p>
              </div>
            </div>
          </div>
        );

      case 2: // Mechanic selection
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">3. Choose a Mechanic</h3>
            <p className="text-sm text-gray-500">Recommended mechanics for **{selectedService.name}**.</p>

            <div className="grid grid-cols-1 gap-4">
              {availableMechanics
                .filter(mechanic => mechanic.available)
                .map(mechanic => (
                  <div
                    key={mechanic.id}
                    className={`p-4 border border-gray-200 rounded-xl shadow-md cursor-pointer transition-all duration-200 ${selectedMechanic?.id === mechanic.id
                      ? "border-orange-600 ring-4 ring-orange-100 bg-orange-50"
                      : "border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-lg"
                      }`}
                    onClick={() => setSelectedMechanic(mechanic)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-orange-600 shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">{mechanic.name}</h4>
                          <p className="text-sm text-gray-500">Specialty: {mechanic.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium text-gray-700">{mechanic.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ${mechanic.hourlyRate}/hr
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <p className="font-medium">Note:</p> Mechanics marked as unavailable are not shown.
            </div>
          </div>
        );

      case 3: // Scheduling
        const nextWeekDays = getNextWeekDays();

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">4. Select Date & Time</h3>

            <div className="mb-6 border border-gray-200 p-4 rounded-xl shadow-md">
              <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2"><Calendar className="w-5 h-5" /> Available Dates (Next 7 days)</h4>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {nextWeekDays.map(date => (
                  <div
                    key={date}
                    className={`p-3 border border-gray-200 rounded-lg text-center cursor-pointer transition-all duration-150 ${selectedDate === date
                      ? "border-orange-600 bg-orange-100 text-orange-700 font-semibold shadow-inner"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700"
                      }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-xs uppercase">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-sm font-medium">
                      {new Date(date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div className="border border-gray-200 p-4 rounded-xl shadow-md">
                <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2"><Clock className="w-5 h-5" /> Available Time Slots on {formatDate(selectedDate)}</h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map(time => (
                    <div
                      key={time}
                      className={`p-3 border rounded-lg text-center cursor-pointer transition-all duration-150 text-sm ${selectedTime === time
                        ? "border-orange-600 bg-orange-100 text-orange-700 font-semibold shadow-inner"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700"
                        }`}
                      onClick={() => setSelectedTime(time)}
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
            <h3 className="text-xl font-semibold text-gray-800">5. Review & Confirm</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Review Panel */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg space-y-4">
                <h4 className="font-bold text-lg text-gray-800 border-b border-gray-200 pb-2">Booking Summary</h4>
                <div className="space-y-3">
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Settings className="w-4 h-4" /> Service:</span>
                    <span className="font-medium text-gray-700">{selectedService.name}</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Car className="w-4 h-4" /> Vehicle:</span>
                    <span className="font-medium text-gray-700">{selectedVehicle.make} {selectedVehicle.model}</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><UserCheck className="w-4 h-4" /> Mechanic:</span>
                    <span className="font-medium text-gray-700">{selectedMechanic.name}</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> Date & Time:</span>
                    <span className="font-medium text-orange-600">
                      {formatDate(selectedDate)} @ {selectedTime}
                    </span>
                  </p>
                </div>
              </div>

              {/* Cost Panel */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-gray-800">Cost Breakdown</h4>
                <div className="border rounded-xl divide-y bg-white shadow-lg">
                  <div className="p-4 flex justify-between text-sm">
                    <span>Service Base Fee</span>
                    <span className="font-medium text-gray-800">${selectedService.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex justify-between text-sm">
                    <span>Labor ({selectedService.duration} mins @ ${selectedMechanic.hourlyRate}/hr)</span>
                    <span className="font-medium text-gray-800">${(selectedMechanic.hourlyRate * (selectedService.duration / 60)).toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex justify-between font-bold text-lg bg-orange-100 rounded-b-xl border-t border-orange-200">
                    <span className="text-orange-700">Estimated Total</span>
                    <span className="text-orange-700">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-medium mb-2 text-gray-700">Additional Notes (Optional)</h4>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-colors"
                rows="3"
                placeholder="Any specific issues or instructions for the mechanic..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>
        );

      case 5: // Confirmation (Final Step)
        return (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed! 🎉</h3>
            <p className="text-lg text-gray-600 mb-8">
              Your service is locked in. We look forward to seeing you.
            </p>
            <div className="bg-gray-50 p-6 rounded-xl max-w-md mx-auto mb-8 border border-gray-200 shadow-inner">
              <p className="font-semibold text-gray-800 mb-2">Service Appointment</p>
              <p className="text-sm text-gray-700">
                **{selectedService.name}** with **{selectedMechanic.name}**
              </p>
              <p className="text-lg font-bold text-orange-600 mt-2">
                {formatDate(selectedDate)} @ {selectedTime}
              </p>
            </div>
            <button
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-lg"
              onClick={() => window.location.reload()}
            >
              Return to Dashboard
            </button>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  // --- Main Component Render ---

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 md:container mx-auto border border-gray-100">

      {/* Progress Steps */}
      {currentStep <= 4 && (
        <div className="mb-10">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-6"></div>
            <div
              className="absolute top-4 left-0 h-0.5 bg-orange-600 -z-10 mx-6 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 shadow-md ${index <= currentStep
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className={`text-xs mt-2 text-center transition-colors duration-200 ${index <= currentStep ? "text-orange-600 font-medium" : "text-gray-500"}`}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[450px]">
        {renderStepContent()}
      </div>

      {/* Navigation Footer (Not shown on Confirmation Step) */}
      {currentStep <= 4 && (
        <>
          {bookingError && (
            <div className="p-3 mt-6 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 transition-opacity duration-300">
              {bookingError}
            </div>
          )}

          <div className={`flex ${currentStep > 0 ? 'justify-between' : 'justify-end'} pt-8 border-t border-gray-200 mt-8`}>
            {currentStep > 0 && (
              <button
                className="px-6 py-2 flex items-center gap-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                onClick={handleBack}
                disabled={isProcessing}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              className={`px-6 py-2 flex items-center gap-1 rounded-xl transition-colors shadow-lg ${currentStep === 4
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-orange-600 text-white hover:bg-orange-700"
                } disabled:opacity-50`}
              onClick={handleNext}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : currentStep === 4
                  ? "Confirm Booking"
                  : "Next Step"
              }
              {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingComponent;