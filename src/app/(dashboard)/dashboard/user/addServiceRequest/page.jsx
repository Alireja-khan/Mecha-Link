"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, MapPin, Clock, AlertTriangle, Car, Bike, Truck, Home, Tv, Zap, Building, Landmark, Pin, Camera } from "lucide-react";
import Button from "@/app/shared/Button";
import toast from "react-hot-toast";
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

// --- UPDATED BANGLADESH LOCATION DATA (8 DIVISIONS, 64 DISTRICTS) ---
const BANGLADESH_LOCATIONS = {
  divisions: [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal",
    "Sylhet", "Rangpur", "Mymensingh"
  ],
  districts: {
    Dhaka: [
      "Dhaka", "Gazipur", "Kishoreganj", "Manikganj", "Munshiganj",
      "Narayanganj", "Narsingdi", "Tangail", "Faridpur", "Gopalganj",
      "Madaripur", "Rajbari", "Shariatpur"
    ],
    Chattogram: [
      "Chattogram", "Bandarban", "Brahmanbaria", "Chandpur", "Cumilla",
      "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali",
      "Rangamati"
    ],
    Rajshahi: [
      "Rajshahi", "Bogra", "Joypurhat", "Naogaon", "Natore",
      "Chapai Nawabganj", "Pabna", "Sirajganj"
    ],
    Khulna: [
      "Khulna", "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah",
      "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"
    ],
    Barishal: [
      "Barishal", "Barguna", "Bhola", "Jhalokati", "Patuakhali",
      "Pirojpur"
    ],
    Sylhet: [
      "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"
    ],
    Rangpur: [
      "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
      "Nilphamari", "Panchagarh", "Thakurgaon"
    ],
    Mymensingh: [
      "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
    ],
  }
};
// --- END OF UPDATED LOCATION DATA ---


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
  { value: "low", label: "Low (Within 1 week)", color: "text-success", icon: Clock },
  { value: "medium", label: "Medium (Within 3 days)", color: "text-warning", icon: AlertTriangle },
  { value: "high", label: "High (Within 24 hours)", color: "text-error", icon: AlertTriangle },
  { value: "emergency", label: "Emergency (Immediate)", color: "text-error", icon: AlertTriangle }
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
      model: "",
      images: [],
      fullAddress: "",
      area: "",
      city: "",
      division: ""
    }
  });

  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableBrands, setAvailableBrands] = useState([]);

  const watchDeviceType = watch("deviceType");
  const watchImages = watch("images");
  const watchDivision = watch("division");
  const watchUrgency = watch("urgency");

  const { data: session } = useSession();
  const loggedInUser = useUser(session?.user?.email)

  useEffect(() => {
    if (watchDeviceType) {
      setValue("problemCategory", "");
      setValue("brand", "");
      if (["car", "bike", "truck"].includes(watchDeviceType)) {
        setValue("model", "");
        setAvailableBrands(VEHICLE_BRANDS[watchDeviceType] || []);
      } else {
        setAvailableBrands([]);
      }
      setValue("year", "");
      setValue("vin", "");
    }
  }, [watchDeviceType, setValue]);

  useEffect(() => {
    setValue("city", "");
  }, [watchDivision, setValue]);


  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const existingFiles = watchImages || [];
    const MAX_FILES = 5;
    const totalNewCount = existingFiles.length + newFiles.length;

    if (totalNewCount > MAX_FILES) {
      const filesToAdd = MAX_FILES - existingFiles.length;
      const mergedFiles = [...existingFiles, ...newFiles.slice(0, filesToAdd)];
      setValue("images", mergedFiles);
      toast.error(`Maximum 5 images allowed. Only added ${filesToAdd} from your last selection.`);
    } else {
      const mergedFiles = [...existingFiles, ...newFiles];
      setValue("images", mergedFiles);
    }
    event.target.value = null;
  };


  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        // Ensure you have this environment variable set
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


  const onSubmit = async (data) => {
    if (!data.fullAddress || !data.area || !data.city || !data.division) {
      toast.error("Please fill in all address details for service coverage.");
      Swal.fire({
        title: 'Address Required',
        text: 'Please enter the Full Address, Area, City/District, and Division/Region.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setUploadProgress(0);
      let uploadedImages = [];
      const filesToUpload = data.images || [];

      if (filesToUpload.length > 0) {
        const uploadToast = toast.loading(`Uploading images (0/${filesToUpload.length})`);
        for (let i = 0; i < filesToUpload.length; i++) {
          if (filesToUpload[i].size > 5 * 1024 * 1024) {
            toast.error(`Image ${i + 1} is too large (>${5}MB). Skipping.`);
            continue;
          }
          const imageUrl = await uploadImageToImgbb(filesToUpload[i]);
          uploadedImages.push(imageUrl);
          toast.loading(`Uploading images (${i + 1}/${filesToUpload.length})`, { id: uploadToast });
          setUploadProgress(((i + 1) / filesToUpload.length) * 100);
        }
        toast.dismiss();
      }

      const userId = loggedInUser?.user?._id;
      const userEmail = session?.user?.email || loggedInUser?.email || "guest@example.com";
      const userName = session?.user?.name || loggedInUser?.name || "Guest User";
      const userImage = session?.user?.profileImage || loggedInUser?.profileImage || "Guest User";

      const isVehicle = ["car", "bike", "truck"].includes(data.deviceType);

      const formData = {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        userImage: userImage,
        deviceType: data.deviceType,
        problemCategory: data.problemCategory,
        serviceDetails: {
          problemTitle: data.problemTitle,
          description: data.description,
          images: uploadedImages,
          urgency: data.urgency,
          vehicleInfo: isVehicle ? {
            brand: data.brand,
            model: data.model,
            year: data.year,
            vin: data.vin
          } : {
            brand: data.brand,
            model: data.model,
            year: null,
            vin: null
          }
        },
        location: {
          address: data.fullAddress,
          area: data.area,
          city: data.city,
          division: data.division,
          latitude: location.latitude,
          longitude: location.longitude,
        },
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


  const removeImage = (indexToRemove) => {
    const newImages = watchImages.filter((_, index) => index !== indexToRemove);
    setValue("images", newImages);
  };

  const getUrgencyIcon = (urgency) => {
    const level = URGENCY_LEVELS.find(l => l.value === urgency);

    if (!level) return null;

    const IconComponent = level.icon;
    return <IconComponent className={`h-4 w-4 ${level.color}`} />;
  };

  const getUrgencyLabel = (urgency) => {
    const level = URGENCY_LEVELS.find(l => l.value === urgency);
    return level ? level.label : "Not selected";
  }


  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 text-base-content">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Service Request Form
          </h1>
          <p className="text-lg text-neutral-content">
            Get professional help for your vehicle or appliance repair needs
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">

          <div className="xl:col-span-1 space-y-6">

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <User className="h-5 w-5" /> Device/Vehicle Information
              </h2>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Device Type</label>
                  <select
                    {...register("deviceType", { required: "Device type is required" })}
                    className="w-full p-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  >
                    <option value="">Select what needs service</option>
                    {Object.entries(DEVICE_TYPES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  {errors.deviceType && (
                    <p className="text-sm text-error mt-1">{errors.deviceType.message}</p>
                  )}
                </div>

                {watchDeviceType && ["car", "bike", "truck"].includes(watchDeviceType) && (
                  <div className="grid gap-4 p-4 bg-accent/20 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-base-content">Brand</label>
                      <input
                        type="text"
                        {...register("model", {
                          required: "Brand is required for vehicles"
                        })}
                        className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                        placeholder="Vehicle Brand"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-base-content">Model</label>
                      <input
                        type="text"
                        {...register("model", {
                          required: "Model is required for vehicles"
                        })}
                        className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                        placeholder="Vehicle Model (e.g., Civic, R15)"
                      />
                      {errors.model && (
                        <p className="text-sm text-error mt-1">{errors.model.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-base-content">Year</label>
                        <input
                          type="number"
                          {...register("year", {
                            min: { value: 1900, message: "Year must be after 1900" },
                            max: {
                              value: new Date().getFullYear() + 1,
                              message: `Year cannot be in the future`
                            }
                          })}
                          className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                          placeholder="e.g., 2020"
                        />
                        {errors.year && (
                          <p className="text-sm text-error mt-1">{errors.year.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-base-content">VIN</label>
                        <input
                          {...register("vin", {
                            pattern: {
                              value: /^[A-HJ-NPR-Z0-9]{17}$/,
                              message: "VIN must be 17 characters (letters and numbers)"
                            }
                          })}
                          className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                          placeholder="Vehicle Identification Number"
                          maxLength={17}
                        />
                        {errors.vin && (
                          <p className="text-sm text-error mt-1">{errors.vin.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {watchDeviceType && !["car", "bike", "truck"].includes(watchDeviceType) && watchDeviceType !== "other" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-base-content">Brand</label>
                      <input
                        {...register("brand")}
                        className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                        placeholder={`e.g., Samsung, LG`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-base-content">Model</label>
                      <input
                        {...register("model")}
                        className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                        placeholder={`e.g., AA5000, 42-inch LED`}
                      />
                    </div>
                  </>
                )}

                {watchDeviceType && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-content">Problem Category</label>
                    <input
                      type="text"
                      {...register("model", {
                        required: "problem is required for vehicles"
                      })}
                      className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                      placeholder="Problem category (e.g., Engine)"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <AlertTriangle className="h-5 w-5" /> Service Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Problem Title</label>
                  <input
                    {...register("problemTitle", { required: "Problem title is required" })}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="Brief description of the problem"
                  />
                  {errors.problemTitle && (
                    <p className="text-sm text-error mt-1">{errors.problemTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Detailed Description</label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: { value: 20, message: "Description should be at least 20 characters" }
                    })}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="Describe the problem in detail, including any symptoms, when it started, and what you've tried..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-error mt-1">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <MapPin className="h-5 w-5" /> Service Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content flex items-center gap-1">
                    <Pin className="h-4 w-4 text-secondary" /> Full Address / Street
                  </label>
                  <input
                    {...register("fullAddress", { required: "Full Address is required" })}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="House/Plot/Holding No., Road Name/No."
                  />
                  {errors.fullAddress && (
                    <p className="text-sm text-error mt-1">{errors.fullAddress.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content flex items-center gap-1">
                    <Building className="h-4 w-4 text-secondary" /> Area / Moholla
                  </label>
                  <input
                    {...register("area", { required: "Area/Moholla is required" })}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="e.g., Mirpur DOHS, Dhanmondi"
                  />
                  {errors.area && (
                    <p className="text-sm text-error mt-1">{errors.area.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-content flex items-center gap-1">
                      <Landmark className="h-4 w-4 text-secondary" /> Division / Region
                    </label>
                    <select
                      {...register("division", { required: "Division is required" })}
                      className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    >
                      <option value="">Select Division</option>
                      {BANGLADESH_LOCATIONS.divisions.map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                    {errors.division && (
                      <p className="text-sm text-error mt-1">{errors.division.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-base-content flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-secondary" /> City / District
                    </label>
                    <select
                      {...register("city", { required: "City/District is required" })}
                      className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content disabled:bg-gray-200 disabled:opacity-70"
                      disabled={!watchDivision}
                    >
                      <option value="">Select District</option>
                      {watchDivision && BANGLADESH_LOCATIONS.districts[watchDivision]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-sm text-error mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <Camera /> Problem Images
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">
                    Upload Images ({watchImages?.length || 0}/5)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={watchImages.length >= 5}
                    className="w-full border border-neutral rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/90 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {watchImages.length >= 5 && (
                    <p className="text-sm text-warning mt-1">Maximum limit of 5 images reached.</p>
                  )}

                  {watchImages.some(file => file.size > 5 * 1024 * 1024) && (
                    <p className="text-sm text-error mt-1">Each image must be less than 5MB.</p>
                  )}

                  {watchImages && watchImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-neutral-content mb-2">Image Previews:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {watchImages.map((file, i) => (
                          <div key={i} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${i}`}
                              className="w-full h-20 object-cover rounded-lg border border-neutral"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-2 -right-2 bg-error text-error-content rounded-full w-5 h-5 text-xs flex items-center justify-center transition-colors hover:bg-error/80"
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

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <Clock className="h-5 w-5" /> Scheduling Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Urgency Level</label>
                  <select
                    {...register("urgency")}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                  >
                    {URGENCY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- URGENCY ICON DISPLAY FIX --- */}
                {watchUrgency && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-base-300/50">
                    {getUrgencyIcon(watchUrgency)}
                    <span className={`text-sm font-semibold ${URGENCY_LEVELS.find(l => l.value === watchUrgency)?.color}`}>
                      **Current Urgency:** {getUrgencyLabel(watchUrgency)}
                    </span>
                  </div>
                )}
                {/* --- END URGENCY ICON DISPLAY FIX --- */}

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Preferred Date</label>
                  <input
                    type="date"
                    {...register("scheduledDate")}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Preferred Time Slot</label>
                  <select
                    {...register("timeSlot")}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                  >
                    <option value="">Any time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Schedule Flexibility</label>
                  <select
                    {...register("flexibility")}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                  >
                    <option value="flexible">Flexible (±2 days)</option>
                    <option value="moderate">Moderate (±1 day)</option>
                    <option value="strict">Strict (Preferred date only)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-neutral h-fit">
              <h2 className="flex items-center gap-2 text-primary mb-4 text-xl font-semibold">
                <User className="h-5 w-5" /> Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Emergency Contact Number</label>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+8801[3-9]\d{8}$/,
                        message: "Please enter a valid Bangladeshi phone number (+8801XXXXXXXXX)"
                      }
                    })}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="+8801XXXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-error mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Alternate Phone Number</label>
                  <input
                    type="tel"
                    {...register("alternatePhone")}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="Optional alternate number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-base-content">Special Instructions</label>
                  <textarea
                    {...register("specialInstructions")}
                    className="w-full p-3 border border-neutral rounded-lg bg-base-100 text-base-content"
                    placeholder="Any special instructions for the mechanic..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 flex flex-col items-center justify-center mt-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 text-lg font-semibold min-w-[250px] rounded-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-content"></div>
                  Submitting Request...
                </span>
              ) : (
                "Submit Service Request"
              )}
            </Button>
          </div>

          {isSubmitting && uploadProgress > 0 && (
            <div className="xl:col-span-3">
              <div className="bg-info/10 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-base-content">Uploading Images</span>
                  <span className="text-sm text-base-content">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                  <div
                    className="bg-info h-2 rounded-full transition-all duration-300"
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