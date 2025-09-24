"use client";
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Wrench } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// --- Data ---
const shopCategories = [
    "Multi-Vehicle Service",
    "Car Service & Repair",
    "Motorcycle Service & Repair",
    "Electric Vehicle Specialist",
    "Body & Paint Specialist",
    "Tire & Wheel Specialist",
    "AC & Cooling Specialist",
];

const weekendOptions = [
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
];

const servicesData = [
    {
        type: "Car",
        categories: {
            "Engine & Performance": [
                "Engine Diagnostics",
                "Engine Overhaul",
                "Oil & Filter Change",
            ],
            "Electrical & Battery": ["Battery Replacement", "Alternator Repair"],
        },
    },
    {
        type: "Motorcycle",
        categories: {
            "Engine & Performance": ["Engine Tuning", "Oil Change"],
            Electrical: ["Battery Replacement", "Wiring Repair"],
        },
    },
];

// --- Custom Dropdown ---
const CustomDropdown = forwardRef(
    ({ options, name, onChange, onBlur, isMulti = true, value }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const [selectedItems, setSelectedItems] = useState(
            isMulti ? value || [] : value ? [value] : []
        );
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
            setSelectedItems(isMulti ? value || [] : value ? [value] : []);
        }, [value, isMulti]);

        const handleToggle = () => setIsOpen(!isOpen);

        const handleSelect = (item) => {
            let newSelected;
            if (isMulti) {
                newSelected = selectedItems.includes(item)
                    ? selectedItems.filter((i) => i !== item)
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
                        {selectedItems.length > 0
                            ? selectedItems.join(", ")
                            : `Select ${name}...`}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                                className={`p-2 cursor-pointer hover:bg-orange-50 transition-colors ${selectedItems.includes(option)
                                        ? "bg-orange-100 font-semibold text-orange-700"
                                        : "text-gray-700"
                                    }`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

// --- Main Component ---
export default function MechanicShop() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const shopId = uuidv4();
            const payload = { ...data, shopId };

            const res = await fetch("/api/shops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Shop registered successfully!");
                reset();
            } else {
                const err = await res.json();
                toast.error(err.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to register shop");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:container mx-auto py-10 bg-gray-50 min-h-screen">
            <Toaster />
            <div className="mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-orange-500 mb-2">
                        Add Mechanic Shop
                    </h1>
                    <p className="text-lg text-gray-600">
                        Create your professional profile and manage your services
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid md:grid-cols-2 gap-8"
                >
                    {/* LEFT COLUMN: Shop Info */}
                    <div className="space-y-8">
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">
                                <Wrench className="h-6 w-6 text-orange-500" /> Shop Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Shop Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("shop.shopName", {
                                            required: "Shop name is required",
                                        })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="AutoFix Garage"
                                    />
                                    {errors.shop?.shopName && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.shop.shopName.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Categories
                                    </label>
                                    <Controller
                                        name="shop.categories"
                                        control={control}
                                        defaultValue={[]}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={shopCategories}
                                                name="Categories"
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Working Hours */}
                    <div className="space-y-8">
                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">
                                Working Hours
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Open
                                    </label>
                                    <input
                                        type="time"
                                        {...register("shop.workingHours.open")}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Close
                                    </label>
                                    <input
                                        type="time"
                                        {...register("shop.workingHours.close")}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Weekend
                                    </label>
                                    <Controller
                                        name="shop.workingHours.weekend"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={weekendOptions}
                                                name="Weekend"
                                                isMulti={false}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                        >
                            {loading ? "Saving..." : "Add Shop"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
