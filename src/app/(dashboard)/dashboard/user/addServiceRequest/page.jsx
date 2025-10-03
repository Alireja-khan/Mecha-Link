"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, MapPin, Clock, AlertTriangle, Car, Bike, Truck, Home, Tv, Zap } from "lucide-react";
import Button from "@/app/shared/Button";
import toast from "react-hot-toast";
import AddressSelector from "../../components/AddressSelector";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import useUser from "@/hooks/useUser";

const VEHICLE_BRANDS = {

  car: [
    "Toyota", "Honda", "Nissan", "Mitsubishi", "Suzuki", "Hyundai", "Kia",
    "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Ford", "Chevrolet",
    "Mazda", "Subaru", "Lexus", "Volvo", "Jeep", "Land Rover", "Other"
  ],
  bike: [
    "Yamaha", "Honda", "Suzuki", "Bajaj", "TVS", "Hero", "Kawasaki",
    "KTM", "Royal Enfield", "Harley-Davidson", "Ducati", "BMW Motorrad",
    "SYM", "Vespa", "Other"
  ],
  truck: [
    "Toyota", "Hino", "Isuzu", "Mitsubishi Fuso", "Nissan", "Tata",
    "Ashok Leyland", "Eicher", "Mahindra", "Volvo Trucks", "Scania",
    "MAN", "Other"
  ]
};

const VEHICLE_MODELS = {
  "Toyota": [
    "Corolla", "Camry", "Premio", "Allion", "Noah", "Voxy", "Aqua",
    "Prius", "Vitz", "Raize", "Rush", "Hilux", "Land Cruiser", "Fortuner", "Other"
  ],
  "Honda": [
    "Civic", "Accord", "City", "Fit", "Vezel", "CR-V", "HR-V", "BR-V",
    "Stepwagon", "Freed", "N-Box", "Other"
  ],
  "Nissan": [
    "Sunny", "Tiida", "Note", "March", "X-Trail", "Qashqai", "Patrol",
    "Navara", "Juke", "Other"
  ],
  "Yamaha": [
    "YZF-R15", "MT-15", "FZ", "FZS", "R15", "MT-07", "MT-09", "YZF-R3",
    "Fazer", "FZ-S", "Other"
  ],
  "Suzuki": [
    "Gixxer", "Hayabusa", "V-Strom", "Burgman", "Access", "Intruder",
    "GSX-R", "Other"
  ],
  "Other": ["Other"]
};

const DEVICE_TYPES = {
  car: { label: "Car", icon: Car, categories: ["Engine", "Transmission", "Brakes", "Electrical", "AC", "Tires", "General Maintenance"] },
  bike: { label: "Bike", icon: Bike, categories: ["Engine", "Brakes", "Electrical", "Chain", "Tires", "General Maintenance"] },
  truck: { label: "Truck", icon: Truck, categories: ["Engine", "Brakes", "Suspension", "Electrical", "Hydraulic", "General Maintenance"] },
  refrigerator: { label: "Refrigerator", icon: Home, categories: ["Cooling Issue", "Electrical", "Compressor", "Thermostat", "General Repair"] },
  ac: { label: "AC", icon: Zap, categories: ["Cooling Issue", "Electrical", "Compressor", "Gas Refill", "General Maintenance"] },
  tv: { label: "TV", icon: Tv, categories: ["Display Issue", "Sound Problem", "Electrical", "Remote Issue", "General Repair"] },
  other: { label: "Other", icon: Home, categories: ["General Repair", "Electrical", "Mechanical", "Installation"] }
};

const URGENCY_LEVELS = [
  { value: "low", label: "Low (Within 1 week)", color: "text-green-600" },
  { value: "medium", label: "Medium (Within 3 days)", color: "text-yellow-600" },
  { value: "high", label: "High (Within 24 hours)", color: "text-orange-600" },
  { value: "emergency", label: "Emergency (Immediate)", color: "text-red-600" }
];

const ServiceRequest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      deviceType: "",
      problemCategory: "",
      urgency: "medium",
      brand: "",
      model: ""
    }
  });

  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  const watchDeviceType = watch("deviceType");
  const watchImages = watch("images");
  const watchUrgency = watch("urgency");
  const watchBrand = watch("brand");
  const { data: session } = useSession();
  const loggedInUser = useUser(session?.user?.email)

  // ------------------------------------------
  // LOG USER ID, NAME, AND EMAIL ON PAGE LOAD
  // ------------------------------------------
  useEffect(() => {
    // Attempt to get the most complete user data
    // const userId = session?._id || session?.user?.id || loggedInUser?._id || "N/A";
    // const userName = session?.user?.name || loggedInUser?.name || "Guest User";
    // const userEmail = session?.user?.email || loggedInUser?.email || "guest@example.com";

    // console.log("--- ServiceRequest Page Loaded ---");
    // console.log(`User ID: ${userId}`);
    // console.log(`User Name: ${userName}`);
    // console.log(`User Email: ${userEmail}`);
    // console.log("----------------------------------");

    console.log(loggedInUser?.user?._id);
  }, [session, loggedInUser]); // Depend on session and loggedInUser to catch asynchronous loading
  // ------------------------------------------

  useEffect(() => {
    if (watchDeviceType) {
      setValue("problemCategory", "");
      setValue("brand", "");
      setValue("model", "");
      setValue("year", "");
      setValue("vin", "");

      if (["car", "bike", "truck"].includes(watchDeviceType)) {
        setAvailableBrands(VEHICLE_BRANDS[watchDeviceType] || []);
      } else {
        setAvailableBrands([]);
      }
      setAvailableModels([]);
    }
  }, [watchDeviceType, setValue]);

  useEffect(() => {
    if (watchBrand && watchDeviceType && ["car", "bike", "truck"].includes(watchDeviceType)) {
      setAvailableModels(VEHICLE_MODELS[watchBrand] || ["Other"]);
      setValue("model", "");
    } else {
      setAvailableModels([]);
    }
  }, [watchBrand, watchDeviceType, setValue]);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_ImgBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  console.log(loggedInUser);

  const onSubmit = async (data) => {
    if (!location.address || !location.latitude || !location.longitude) {
      toast.error("Please select a valid location");
      Swal.fire({
        title: 'Location Required',
        text: 'Please select a valid location',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setUploadProgress(0);
      let uploadedImages = [];

      if (data.images && data.images.length > 0) {
        const uploadToast = toast.loading(`Uploading images (0/${data.images.length})`);
        for (let i = 0; i < data.images.length; i++) {
          const imageUrl = await uploadImageToImgbb(data.images[i]);
          uploadedImages.push(imageUrl);
          toast.loading(`Uploading images (${i + 1}/${data.images.length})`, { id: uploadToast });
          setUploadProgress(((i + 1) / data.images.length) * 100);
        }
        toast.dismiss();
      }

      const userId = loggedInUser?.user?._id;
      const userEmail = session?.user?.email || loggedInUser?.email || "guest@example.com";
      const userName = session?.user?.name || loggedInUser?.name || "Guest User";

      const formData = {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        deviceType: data.deviceType,
        problemCategory: data.problemCategory,
        serviceDetails: {
          problemTitle: data.problemTitle,
          description: data.description,
          images: uploadedImages,
          urgency: data.urgency,
          vehicleInfo: {
            brand: data.brand,
            model: data.model,
            year: data.year,
            vin: data.vin
          }
        },
        location,
        contactInfo: {
          phoneNumber: data.phoneNumber,
          alternatePhone: data.alternatePhone,
          specialInstructions: data.specialInstructions
        },
        status: "pending",
        assignedShopId: null,
        requestedDate: new Date().toISOString(),
        preferredSchedule: {
          date: data.scheduledDate || null,
          timeSlot: data.timeSlot || null,
          flexibility: data.flexibility || "flexible"
        },
        estimatedBudget: data.budgetRange,
        completedDate: null,
      };

      console.log("Submitting data:", formData);

      const res = await fetch("/api/service-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        await Swal.fire({
          title: 'Success!',
          text: 'Service request submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        reset();
        setLocation({ address: "", latitude: null, longitude: null });
        setUploadProgress(0);
      } else {
        throw new Error(result.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to submit request. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };


  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "low": return <Clock className="h-4 w-4 text-green-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "emergency": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Service Request Form
          </h1>
          <p className="text-lg text-gray-600">
            Get professional help for your vehicle or appliance repair needs
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <User className="h-5 w-5" /> Device/Vehicle Information
              </h2>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Device Type *</label>
                  <select
                    {...register("deviceType", { required: "Device type is required" })}
                    className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select what needs service</option>
                    {Object.entries(DEVICE_TYPES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.deviceType && (
                    <p className="text-sm text-red-500 mt-1">{errors.deviceType.message}</p>
                  )}
                </div>

                {watchDeviceType && ["car", "bike", "truck"].includes(watchDeviceType) && (
                  <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2">Brand *</label>
                      <select
                        {...register("brand", {
                          required: "Brand is required for vehicles"
                        })}
                        className="w-full p-3 border border-neutral rounded-lg"
                      >
                        <option value="">Select brand</option>
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      {errors.brand && (
                        <p className="text-sm text-red-500 mt-1">{errors.brand.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Model *</label>
                      <select
                        {...register("model", {
                          required: "Model is required for vehicles"
                        })}
                        className="w-full p-3 border border-neutral rounded-lg"
                        disabled={!watchBrand}
                      >
                        <option value="">{watchBrand ? "Select model" : "Select brand first"}</option>
                        {availableModels.map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      {errors.model && (
                        <p className="text-sm text-red-500 mt-1">{errors.model.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <input
                          type="number"
                          {...register("year", {
                            min: { value: 1900, message: "Year must be after 1900" },
                            max: {
                              value: new Date().getFullYear() + 1,
                              message: `Year cannot be in the future`
                            }
                          })}
                          className="w-full p-3 border border-neutral rounded-lg"
                          placeholder="e.g., 2020"
                        />
                        {errors.year && (
                          <p className="text-sm text-red-500 mt-1">{errors.year.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">VIN (Optional)</label>
                        <input
                          {...register("vin", {
                            pattern: {
                              value: /^[A-HJ-NPR-Z0-9]{17}$/,
                              message: "VIN must be 17 characters (letters and numbers)"
                            }
                          })}
                          className="w-full p-3 border border-neutral rounded-lg"
                          placeholder="Vehicle Identification Number"
                          maxLength={17}
                        />
                        {errors.vin && (
                          <p className="text-sm text-red-500 mt-1">{errors.vin.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {watchDeviceType && !["car", "bike", "truck"].includes(watchDeviceType) && watchDeviceType !== "other" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Brand (Optional)</label>
                    <input
                      {...register("brand")}
                      className="w-full p-3 border border-neutral rounded-lg"
                      placeholder={`e.g., Samsung, LG, General, etc.`}
                    />
                  </div>
                )}

                {watchDeviceType && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Problem Category *</label>
                    <select
                      {...register("problemCategory", { required: "Problem category is required" })}
                      className="w-full p-3 border border-neutral rounded-lg"
                    >
                      <option value="">Select problem category</option>
                      {DEVICE_TYPES[watchDeviceType]?.categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.problemCategory && (
                      <p className="text-sm text-red-500 mt-1">{errors.problemCategory.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <AlertTriangle className="h-5 w-5" /> Service Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Problem Title *</label>
                  <input
                    {...register("problemTitle", { required: "Problem title is required" })}
                    className="w-full p-3 border border-neutral rounded-lg"
                    placeholder="Brief description of the problem"
                  />
                  {errors.problemTitle && (
                    <p className="text-sm text-red-500 mt-1">{errors.problemTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Description *</label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: { value: 20, message: "Description should be at least 20 characters" }
                    })}
                    className="w-full p-3 border border-neutral rounded-lg"
                    placeholder="Describe the problem in detail, including any symptoms, when it started, and what you've tried..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                ⚡ Urgency & Budget
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Urgency Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {URGENCY_LEVELS.map((level) => (
                      <label key={level.value} className={`flex items-center p-3 border rounded-lg cursor-pointer ${watchUrgency === level.value ? 'border-primary bg-blue-50' : 'border-gray-300'
                        }`}>
                        <input
                          type="radio"
                          value={level.value}
                          {...register("urgency")}
                          className="hidden"
                        />
                        <span className={`flex items-center gap-1 text-sm ${level.color}`}>
                          {getUrgencyIcon(level.value)}
                          {level.label.split(' ')[0]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Budget Range (BDT)</label>
                  <select
                    {...register("budgetRange")}
                    className="w-full p-3 border border-neutral rounded-lg"
                  >
                    <option value="">Not sure</option>
                    <option value="0-1000">0 - 1,000 BDT</option>
                    <option value="1000-5000">1,000 - 5,000 BDT</option>
                    <option value="5000-10000">5,000 - 10,000 BDT</option>
                    <option value="10000-20000">10,000 - 20,000 BDT</option>
                    <option value="20000-50000">20,000 - 50,000 BDT</option>
                    <option value="50000+">50,000+ BDT</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    This helps mechanics provide appropriate quotes
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <MapPin className="h-5 w-5" /> Service Location
              </h2>

              <div className="space-y-4">
                <label className="block text-sm font-medium">Select your location *</label>
                <AddressSelector location={location} setLocation={setLocation} />

                {!location.address && (
                  <p className="text-sm text-yellow-600">Please select your location on the map</p>
                )}
                {location.address && (
                  <p className="text-sm text-green-600">✅ Location selected: {location.address}</p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                📸 Problem Images
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Images ({watchImages?.length || 0}/5)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("images", {
                      validate: {
                        maxFiles: files => !files || files.length <= 5 || "Maximum 5 images allowed",
                        maxSize: files => {
                          if (files) {
                            for (let file of files) {
                              if (file.size > 5 * 1024 * 1024) {
                                return "Each image should be less than 5MB";
                              }
                            }
                          }
                          return true;
                        }
                      }
                    })}
                    className="w-full border border-neutral rounded-lg p-3"
                  />
                  {errors.images && (
                    <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
                  )}

                  {watchImages && watchImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Image Previews:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from(watchImages).map((file, i) => (
                          <div key={i} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${i}`}
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = Array.from(watchImages);
                                newImages.splice(i, 1);
                                setValue("images", newImages);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <Clock className="h-5 w-5" /> Scheduling Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <input
                    type="date"
                    {...register("scheduledDate")}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-neutral rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Time Slot</label>
                  <select
                    {...register("timeSlot")}
                    className="w-full p-3 border border-neutral rounded-lg"
                  >
                    <option value="">Any time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Schedule Flexibility</label>
                  <select
                    {...register("flexibility")}
                    className="w-full p-3 border border-neutral rounded-lg"
                  >
                    <option value="flexible">Flexible (±2 days)</option>
                    <option value="moderate">Moderate (±1 day)</option>
                    <option value="strict">Strict (Preferred date only)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <User className="h-5 w-5" /> Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Emergency Contact Number *</label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+8801[3-9]\d{8}$/,
                        message: "Please enter a valid Bangladeshi phone number (+8801XXXXXXXXX)"
                      }
                    })}
                    className="w-full p-3 border border-neutral rounded-lg"
                    placeholder="+8801XXXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alternate Phone Number</label>
                  <input
                    type="tel"
                    {...register("alternatePhone")}
                    className="w-full p-3 border border-neutral rounded-lg"
                    placeholder="Optional alternate number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <textarea
                    {...register("specialInstructions")}
                    className="w-full p-3 border border-neutral rounded-lg"
                    placeholder="Any special instructions for the mechanic..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 flex justify-center mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 text-lg font-semibold min-w-[250px] rounded-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting Request...
                </span>
              ) : (
                "Submit Service Request"
              )}
            </Button>
          </div>

          {isSubmitting && uploadProgress > 0 && (
            <div className="xl:col-span-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Uploading Images</span>
                  <span className="text-sm">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ServiceRequest;