"use client";
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Wrench } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

// --- Data for the Form ---
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
    }
];

const weekendOptions = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

// --- Custom Dropdown Component ---
const CustomDropdown = forwardRef(({ options, name, onChange, onBlur, isMulti = true, value }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState(isMulti ? (value || []) : (value ? [value] : []));
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
        setSelectedItems(isMulti ? (value || []) : (value ? [value] : []));
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

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 focus-within:border-orange-500 transition-colors"
                onClick={handleToggle}
                onBlur={onBlur}
                tabIndex={0}
            >
                <span className="text-gray-700">
                    {selectedItems.length > 0 ? selectedItems.join(', ') : `Select ${name}...`}
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
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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

// --- Certifications Input Component ---
const CertificationsInput = ({ onChange, value }) => {
    const [inputValue, setInputValue] = useState('');
    const tags = value || [];

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmedInput = inputValue.trim();
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
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-orange-500 hover:text-orange-800 focus:outline-none">&times;</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main MechanicShop Component ---
export default function MechanicShop() {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const [activeVehicleType, setActiveVehicleType] = useState('Car');
    const [isLoading, setIsLoading] = useState(false);

    const onInvalid = (errors) => {
        console.log(errors);
        toast.error("Please fill in all required fields.");
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const res = await axios.post("/api/shops", data);

            if (res.status === 200 || res.status === 201) {
                toast.success("Shop added successfully!");
                console.log("Inserted ID:", res.data.insertedId);
                reset();
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
            <div className="mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-orange-500 mb-2">Add Mechanic Shop</h1>
                    <p className="text-lg text-gray-600">Create your professional profile and manage your services</p>
                </div>

                {/* Updated form onSubmit handler to include onInvalid */}
                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="space-y-8">
                        {/* Shop Info */}
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
                                    <label className="block text-sm font-medium text-gray-700">Shop Logo URL</label>
                                    <input
                                        type="url"
                                        {...register('logo')}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="https://example.com/logo.png"
                                    />
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Categories</label>
                                    <Controller
                                        name="shop.categories"
                                        control={control}
                                        defaultValue={[]}
                                        rules={{ required: "At least one category is required" }}
                                        render={({ field }) => <CustomDropdown options={shopCategories} name="Categories" onChange={field.onChange} onBlur={field.onBlur} value={field.value} />}
                                    />
                                    {errors.shop?.categories && <p className="text-sm text-red-500 mt-1">{errors.shop.categories.message}</p>}
                                </div>
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
                                </fieldset>
                            </div>
                        </div>

                        {/* Contact & Social Links */}
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">Contact & Social Links</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="tel" {...register('shop.contact.phone', { required: "Phone number is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    {errors.shop?.contact?.phone && <p className="text-sm text-red-500 mt-1">{errors.shop.contact.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" {...register('shop.contact.email', { required: "Email is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                    {errors.shop?.contact?.email && <p className="text-sm text-red-500 mt-1">{errors.shop.contact.email.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">WhatsApp (optional)</label>
                                    <input type="tel" {...register('shop.contact.whatsapp')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Facebook URL (optional)</label>
                                    <input type="url" {...register('socialLinks.facebook')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL (optional)</label>
                                    <input type="url" {...register('socialLinks.linkedin')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        {/* Working Hours */}
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

                        {/* Services Offered */}
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">
                                <Wrench className="h-6 w-6 text-orange-500" /> Services Offered
                            </h2>
                            <div className="flex gap-4 mb-4">
                                <button type="button" onClick={() => setActiveVehicleType('Car')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeVehicleType === 'Car' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Car Services</button>
                                <button type="button" onClick={() => setActiveVehicleType('Motorcycle')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeVehicleType === 'Motorcycle' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Motorcycle Services</button>
                            </div>
                            {servicesData.filter(vehicle => vehicle.type === activeVehicleType).map(vehicle => (
                                <div key={vehicle.type} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{vehicle.type} Services</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(vehicle.categories).map(([category, services]) => (
                                            <div key={category} className="space-y-2">
                                                <h4 className="text-md font-medium text-orange-700">{category}</h4>
                                                {services.map(service => (
                                                    <label key={service} className="flex items-center gap-3 cursor-pointer select-none">
                                                        <input type="checkbox" value={service} {...register(`shop.vehicleTypes.${vehicle.type}.categories.${category}`)} className="w-5 h-5 accent-orange-500 rounded-md cursor-pointer" />
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

                    {/* Submit Button */}
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