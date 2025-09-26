"use client";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {User, MapPin} from "lucide-react";
import Button from "@/app/shared/Button";
import toast from "react-hot-toast";
import AddressSelector from "../../components/AddressSelector";
const imgbbApiKey = ""; 


const ServiceRequest = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm();

  const [location, setLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
  });


  const images = watch("images");

  // Upload image to ImgBB
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.success) return data.data.url;
    else throw new Error("Image upload failed");
  };

  // Handle form submit
  const onSubmit = async (data) => {
    try {
      toast.loading("Uploading images...");
      let uploadedImages = [];

      if (data.images && data.images.length > 0) {
        uploadedImages = await Promise.all(
          Array.from(data.images).map((file) => uploadImageToImgbb(file))
        );
      }
      toast.dismiss();

      const formData = {
        userId: "USR789",
        deviceType: data.deviceType,
        serviceDetails: {
          problemTitle: data.problemTitle,
          problemType: data.problemType,
          description: data.description,
          images: uploadedImages,
        },
        location,
        status: "Pending",
        assignedShopId: null,
        requestedDate: new Date().toISOString(),
        scheduledDate: data.scheduledDate || null,
        completedDate: null,
      };

      console.log("🚗 Final Service Request:", formData);
      toast.success("Service request submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request.");
    }
  };

  
  console.log(location);

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Service Request Form
          </h1>
          <p className="text-lg">
            Fill out the details below to request a service
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Device Type */}
            <div className="p-4 border border-neutral rounded shadow-sm">
              <h2 className="flex items-center gap-2 text-primary mb-4">
                <User className="h-5 w-5" /> Select Device Type
              </h2>
              <select
                {...register("deviceType", {
                  required: "Device type is required",
                })}
                className="w-full p-2 border rounded border-neutral"
              >
                <option value="">Select device type</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="truck">Truck</option>
                <option value="refrigerator">Refrigerator</option>
                <option value="ac">AC</option>
                <option value="tv">TV</option>
                <option value="other">Other</option>
              </select>
              {errors.deviceType && (
                <p className="text-sm text-red-500">
                  {errors.deviceType.message}
                </p>
              )}
            </div>

            {/* Service Details */}
            <div className="p-4 border border-neutral rounded shadow-sm">
              <h2 className="flex items-center gap-2 text-primary mb-4">
                <User className="h-5 w-5" /> Service Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label>Problem Title </label>
                  <input
                    {...register("problemTitle", {
                      required: "Problem title is required",
                    })}
                    className="w-full p-2 border border-neutral rounded"
                    placeholder="e.g. Engine making noise"
                  />
                  {errors.problemTitle && (
                    <p className="text-sm text-red-500">
                      {errors.problemTitle.message}
                    </p>
                  )}
                </div>

                

                <div>
                  <label>Description </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full p-2 border border-neutral rounded"
                    placeholder="Describe the problem"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label>Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("images")}
                    className="w-full border border-neutral rounded p-2"
                  />
                  {/* Preview */}
                  {images && images.length > 0 && (
                    <div className="flex flex-wrap mt-2 gap-2">
                      {Array.from(images).map((file, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-24 h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Location */}
            <div className="p-4 border border-neutral rounded shadow-sm">
              <h2 className="flex items-center gap-2 text-primary mb-4">
                <User className="h-5 w-5" /> User Details
              </h2>
              <div>
                <label>Emergency Contact Number </label>
                <input
                  type="tel"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+8801[0-9]{8}$/,
                      message:
                        "Phone number must start with +8801 and be 11 digits long",
                    },
                  })}
                  className="w-full p-2 border border-neutral rounded"
                  placeholder="+880123456789"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <label className="block font-medium mt-2">Select your location</label>
              <AddressSelector location={location} setLocation={setLocation}/>
              
            </div>

            {/* Scheduled Date */}
            <div className="p-4 border border-neutral rounded shadow-sm">
              <label>Preferred Scheduled Date (optional)</label>
              <input
                type="datetime-local"
                {...register("scheduledDate")}
                className="w-full p-2 border border-neutral rounded"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center mt-4">
            <Button type="submit" className="px-8">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequest;
