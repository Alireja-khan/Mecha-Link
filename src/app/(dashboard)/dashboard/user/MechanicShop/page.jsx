"use client";
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Wrench, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import useUser from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

const shopCategories = [
    "Multi-Vehicle Service",
    "Car Service & Repair",
    "Motorcycle Service & Repair",
    "Electric Vehicle Specialist",
    "Body & Paint Specialist",
    "Tire & Wheel Specialist",
    "AC & Cooling Specialist"
];

const servicesData = [
    {
        type: "Car",
        categories: {
            "Engine & Performance": ["Engine Diagnostics", "Engine Overhaul", "Oil & Filter Change", "Fuel Injector Cleaning", "Timing Belt Replacement", "Fuel Pump Repair"],
            "Electrical & Battery": ["Battery Replacement", "Alternator Repair", "Starter Motor Repair", "ECU Programming", "Key Programming"],
            "Transmission & Clutch": ["Transmission Repair", "Clutch Replacement", "Gearbox Service"],
            "Brakes & Suspension": ["Brake Repair", "ABS System Repair", "Suspension Work", "Steering Alignment"],
            "Cooling & AC": ["Cooling System Service", "Radiator Repair", "AC Repair", "AC Gas Refill"],
            "Tires & Wheels": ["Tire Replacement", "Tire Balancing", "Wheel Alignment"],
            "Body & Exterior": ["Body Denting & Painting", "Scratch Removal", "Accident Repair", "Glass & Windshield Replacement", "Headlight & Taillight Repair"],
            "Cleaning & Care": ["Car Wash", "Interior Cleaning", "Car Polishing & Detailing"]
        }
    },
    {
        type: "Motorcycle",
        categories: {
            "Engine & Performance": ["Engine Tuning", "Oil Change", "Piston & Cylinder Repair"],
            "Transmission & Drive": ["Clutch Repair", "Gearbox Repair", "Chain & Sprocket Replacement"],
            "Brakes & Suspension": ["Brake Adjustment", "Disc Brake Repair", "Shock Absorber Repair"],
            "Electrical": ["Battery Replacement", "Wiring Repair", "Headlight & Indicator Repair"],
            "Tires & Wheels": ["Tire Change", "Wheel Balancing"],
            "Body & Care": ["Body Polishing", "Paint Touch-up", "Seat Repair"]
        }
    },
    {
        type: "Trucks & Commercial Vehicles",
        categories: {
            "Heavy Duty Engine": [
                "Diesel Engine Repair & Overhaul",
                "Fleet Oil & Fluid Service",
                "Turbocharger Service",
                "EGR/DPF System Diagnostics & Cleaning (Emissions)",
                "Commercial Vehicle Tune-ups"
            ],
            "Brakes & Air Systems": [
                "Air Brake System Repair & Inspection",
                "Hydraulic Brake Service",
                "Brake Drum/Rotor Replacement",
                "Air Compressor Repair"
            ],
            "Suspension & Steering": [
                "Leaf Spring Repair & Replacement",
                "Axle Alignment",
                "King Pin & Bushing Service",
                "Heavy-Duty Shock Absorber Replacement"
            ],
            "Transmission & Drivetrain": [
                "Heavy-Duty Clutch Replacement",
                "Differential Repair",
                "PTO (Power Take-Off) System Service",
                "Transmission Fluid Flush & Filter Change"
            ],
            "Tires & Wheels": [
                "Commercial Tire Sales & Service",
                "Tire Re-treading Management",
                "Heavy-Duty Wheel Balancing"
            ],
            "Body & Trailer": [
                "Trailer Wiring & Lighting Repair",
                "Lift Gate/Hydraulic System Repair",
                "Cab Body Repair & Painting"
            ]
        }
    },
    {
        type: "Electric Vehicle (EV)",
        categories: {
            "High Voltage Battery": ["Battery Diagnostics & Health Check", "Battery Cooling System Service", "High Voltage Wiring Inspection"],
            "Electric Motor & Drivetrain": ["Electric Motor Diagnostics", "Gearbox Fluid Change", "Inverter and Converter Service"],
            "Charging System": ["On-Board Charger Repair", "Charging Port Inspection & Repair"],
            "Standard EV Services": ["Brake System Inspection", "12V Auxiliary Battery Replacement", "Tire Service"]
        }
    }
];

const weekendOptions = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const CustomDropdown = forwardRef(({ options, name, onChange, onBlur, isMulti = true, value }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const initialSelected = isMulti ? (Array.isArray(value) ? value : []) : (value ? [value] : []);
    const [selectedItems, setSelectedItems] = useState(initialSelected);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedItems(isMulti ? (Array.isArray(value) ? value : []) : (value ? [value] : []));
    }, [value, isMulti]);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (item) => {
        let newSelected;
        if (isMulti) {
            newSelected = selectedItems.includes(item)
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item];
        } else {
            newSelected = [item];
            setIsOpen(false);
        }
        setSelectedItems(newSelected);
        onChange(isMulti ? newSelected : newSelected[0]);
    };

    const displayValue = isMulti
        ? selectedItems.length > 0 ? selectedItems.join(', ') : `Select ${name}...`
        : selectedItems[0] || `Select ${name}...`;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 focus-within:border-orange-500 transition-colors"
                onClick={handleToggle}
                onBlur={onBlur}
                tabIndex={0}
            >
                <span className="text-gray-700">
                    {displayValue}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0
                        111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0
                        010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-60">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`p-2 cursor-pointer hover:bg-orange-50 transition-colors ${selectedItems.includes(option) ? 'bg-orange-100 font-semibold text-orange-700' : 'text-gray-700'}`}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});
CustomDropdown.displayName = 'CustomDropdown';

const CertificationsInput = ({ onChange, value }) => {
    const [inputValue, setInputValue] = useState('');
    const tags = value || [];

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmedInput = inputValue.trim().replace(/,$/, '');
            if (trimmedInput && !tags.includes(trimmedInput)) {
                onChange([...tags, trimmedInput]);
                setInputValue('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddTag}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Bosch Certified, Honda AutoCare"
            />
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <div key={tag} className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
                            <span>{tag}</span>
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-orange-500 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-full">&times;</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const uploadImageToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    if (!process.env.NEXT_PUBLIC_ImgBB_API_KEY) {
        throw new Error("ImgBB API key is not configured.");
    }

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_ImgBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`ImgBB upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data?.data?.url;
    } catch (error) {
        console.error("Error uploading to ImgBB:", error);
        throw error;
    }
};

export default function MechanicShop() {
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm();
    const [activeVehicleType, setActiveVehicleType] = useState(servicesData[0].type);
    const [isLoading, setIsLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const { data: session } = useSession();
    const loggedInUser = useUser(session?.user?.email);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadImageToImgbb(file);
                setLogoUrl(url);
                setValue('shop.logo', url);
                toast.success("Logo uploaded successfully!");
            } catch (err) {
                console.error(err);
                toast.error("Failed to upload logo! Check console for details.");
            }
        }
    };

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setValue('shop.logo', '');
        toast.success("Logo removed.");
    };

    const onInvalid = (errors) => {
        console.error("Form Errors:", errors);
        toast.error("Please fill in all required fields.");
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        const services = {};
        for (const [vehicleType, vehicleData] of Object.entries(data.shop.vehicleTypes || {})) {
            services[vehicleType] = {};
            for (const [category, serviceArray] of Object.entries(vehicleData.categories || {})) {
                const validServices = Array.isArray(serviceArray)
                    ? serviceArray.filter(service => service)
                    : [];

                if (validServices.length > 0) {
                    services[vehicleType][category] = validServices;
                }
            }
        }

        const shopData = {
            ...data.shop,
            vehicleTypes: services,
            contact: {
                ...data.shop.contact,
                email: loggedInUser?.email || null,
                businessEmail: data.businessEmail || null,
            },
            logo: logoUrl || null
        };

        const payload = {
            userId: loggedInUser?._id || session?.user?.email || null,
            shop: shopData,
            certifications: data.certifications,
            socialLinks: data.socialLinks,
            createdAt: new Date().toISOString()
        };

        console.log("Submitting Payload:", payload);

        try {
            const res = await axios.post("/api/shops", payload);

            if (res.status === 200 || res.status === 201) {
                toast.success("Shop added successfully!");
                reset();
                setLogoUrl('');
                setActiveVehicleType(servicesData[0].type);
            } else {
                toast.error(res.data.message || "Failed to add shop");
            }
        } catch (error) {
            console.error("Axios request failed:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="md:container mx-auto py-10 bg-gray-50 min-h-screen">
            <Toaster />
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Add Mechanic Shop</h1>
                    <p className="text-lg text-gray-600">Create your professional profile and manage your services</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">
                                <Wrench className="h-6 w-6 text-orange-500" /> Shop Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                                    <input
                                        type="text"
                                        {...register('shop.shopName', { required: "Shop name is required" })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="AutoFix Garage"
                                    />
                                    {errors.shop?.shopName && <p className="text-sm text-red-500 mt-1">{errors.shop.shopName.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                                    />
                                    {logoUrl && (
                                        <div className="relative mt-4 inline-block">
                                            <img src={logoUrl} alt="Shop Logo" className="h-20 object-contain" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogo}
                                                className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full text-sm leading-none hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                                                aria-label="Remove logo"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categories</label>
                                    <Controller
                                        name="shop.categories"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Please select a category" }}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={shopCategories}
                                                name="Category"
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                                isMulti={false}
                                            />
                                        )}
                                    />
                                    {errors.shop?.categories && <p className="text-sm text-red-500 mt-1">{errors.shop.categories.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Certifications (separate with commas)</label>
                                    <Controller
                                        name="certifications"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => <CertificationsInput onChange={field.onChange} value={field.value} />}
                                    />
                                </div>

                                <fieldset className="border border-gray-200 p-4 rounded-lg space-y-2">
                                    <legend className="px-2 text-md font-medium text-orange-600">Shop Description & Staff</legend>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Shop Details</label>
                                        <textarea
                                            {...register('shop.details')}
                                            rows={4}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Add detailed description of your shop, services, or specialties..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Number of Mechanics</label>
                                        <input
                                            type="number"
                                            {...register('shop.mechanicCount', {
                                                valueAsNumber: true,
                                                min: { value: 0, message: "Count cannot be negative" },
                                            })}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="E.g., 5"
                                        />
                                        {errors.shop?.mechanicCount && <p className="text-sm text-red-500 mt-1">{errors.shop.mechanicCount.message}</p>}
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-200 p-4 rounded-lg space-y-2">
                                    <legend className="px-2 text-md font-medium text-orange-600">Address</legend>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Street</label>
                                        <input type="text" {...register('shop.address.street', { required: "Street is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                        {errors.shop?.address?.street && <p className="text-sm text-red-500 mt-1">{errors.shop.address.street.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input type="text" {...register('shop.address.city', { required: "City is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                        {errors.shop?.address?.city && <p className="text-sm text-red-500 mt-1">{errors.shop.address.city.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input type="text" {...register('shop.address.country', { required: "Country is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                        {errors.shop?.address?.country && <p className="text-sm text-red-500 mt-1">{errors.shop.address.country.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                        <input type="text" {...register('shop.address.postalCode')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Google Maps URL (Optional)</label>
                                        <input
                                            type="url"
                                            {...register('shop.address.mapUrl')}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                            placeholder="Paste the Google Maps 'Share' link or Embed URL"
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">Contact & Social Links</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="tel" {...register('shop.contact.phone', { required: "Phone number is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    {errors.shop?.contact?.phone && <p className="text-sm text-red-500 mt-1">{errors.shop.contact.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Email (optional)</label>
                                    <input
                                        type="email"
                                        {...register('businessEmail')}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="you@business.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp (optional)</label>
                                    <input type="tel" {...register('shop.contact.whatsapp')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facebook URL (optional)</label>
                                    <input type="url" {...register('socialLinks.facebook')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">Working Hours</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Open</label>
                                    <input type="time" {...register('shop.workingHours.open', { required: "Opening time is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    {errors.shop?.workingHours?.open && <p className="text-sm text-red-500 mt-1">{errors.shop.workingHours.open.message}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Close</label>
                                    <input type="time" {...register('shop.workingHours.close', { required: "Closing time is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    {errors.shop?.workingHours?.close && <p className="text-sm text-red-500 mt-1">{errors.shop.workingHours.close.message}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Weekend</label>
                                    <Controller
                                        name="shop.workingHours.weekend"
                                        control={control}
                                        rules={{ required: "Weekend is required" }}
                                        render={({ field }) => <CustomDropdown options={weekendOptions} name="Weekend" isMulti={false} onChange={field.onChange} onBlur={field.onBlur} value={field.value} />}
                                    />
                                    {errors.shop?.workingHours?.weekend && <p className="text-sm text-red-500 mt-1">{errors.shop.workingHours.weekend.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">
                                <Wrench className="h-6 w-6 text-orange-500" /> Services Offered
                            </h2>
                            <div className="flex flex-wrap gap-3 mb-4 pb-2">
                                {servicesData.map(vehicle => (
                                    <button
                                        key={vehicle.type}
                                        type="button"
                                        onClick={() => setActiveVehicleType(vehicle.type)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeVehicleType === vehicle.type ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {vehicle.type}
                                    </button>
                                ))}
                            </div>

                            {servicesData
                                .filter(vehicle => vehicle.type === activeVehicleType)
                                .map(vehicle => (
                                    <div key={vehicle.type} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{vehicle.type} Services</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(vehicle.categories).map(([category, services]) => (
                                                <div key={category} className="space-y-2">
                                                    <h4 className="text-md font-medium text-orange-700">{category}</h4>
                                                    {services.map(service => (
                                                        <label key={service} className="flex items-center gap-3 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                value={service}
                                                                {...register(`shop.vehicleTypes.${vehicle.type}.categories.${category}`)}
                                                                className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer"
                                                            />
                                                            <span className="text-gray-800">{service}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="flex items-center">
                                        Adding...
                                        <svg className="animate-spin h-5 w-5 ml-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </span>
                                </>
                            ) : (
                                "Add Shop"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}