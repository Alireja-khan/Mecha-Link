"use client";
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Wrench, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const locationData = {
    Dhaka: {
        Dhaka: ["Dhamrai", "Dohar", "Keraniganj", "Savar", "Uttara", "Gulshan", "Mirpur"],
        Faridpur: ["Faridpur Sadar", "Bhanga", "Boalmari", "Alfadanga", "Nagarkanda", "Saltha"],
        Gazipur: ["Gazipur Sadar", "Kaliakoir", "Kapasia", "Sreepur"],
        Gopalganj: ["Gopalganj Sadar", "Kashiani", "Muksudpur", "Tungipara"],
        Kishoreganj: ["Kishoreganj Sadar", "Bhairab", "Karimganj", "Katiadi", "Mithamoin", "Nikli"],
        Madaripur: ["Madaripur Sadar", "Shibchar", "Rajoir", "Kalkini"],
        Manikganj: ["Manikganj Sadar", "Singair", "Shibalaya", "Daulatpur"],
        Munshiganj: ["Munshiganj Sadar", "Gajaria", "Louhajang", "Sreenagar"],
        Narayanganj: ["Narayanganj Sadar", "Araihazar", "Sonargaon", "Bandar", "Rupganj"],
        Narsingdi: ["Narsingdi Sadar", "Belabo", "Palash", "Raipura", "Shibpur"],
        Tangail: ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Mirzapur", "Nagarpur", "Sakhipur"],
        Rajbari: ["Rajbari Sadar", "Baliakandi", "Pangsha", "Kalukhali", "Goalanda"],
        Shariatpur: ["Shariatpur Sadar", "Gosairhat", "Bhedarganj", "Naria", "Zanjira"]
    },

    Chattogram: {
        Chattogram: ["Chattogram Sadar", "Pahartali", "Mirsharai", "Sitakunda", "Fatikchhari", "Hathazari", "Rangunia"],
        CoxsBazar: ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ukhia", "Maheshkhali", "Ramu"],
        Bandarban: ["Bandarban Sadar", "Ruma", "Thanchi", "Lama", "Rowangchhari"],
        Khagrachhari: ["Khagrachhari Sadar", "Lakshmipur", "Dighinala", "Manikchhari", "Panchhari", "Mahalchhari"],
        Noakhali: ["Noakhali Sadar", "Chatkhil", "Hatiya", "Senbagh", "Begumganj", "Companiganj"],
        Feni: ["Feni Sadar", "Chhagalnaiya", "Parshuram", "Daganbhuiyan", "Fulgazi"],
        Cumilla: ["Cumilla Sadar", "Chandina", "Debidwar", "Muradnagar", "Meghna", "Barura"],
        Brahmanbaria: ["Brahmanbaria Sadar", "Ashuganj", "Kasba", "Nabinagar", "Sarail"],
        Rangamati: ["Rangamati Sadar", "Kaptai", "Kanchana", "Baghaichhari", "Rajasthali"],
        Chandpur: ["Chandpur Sadar", "Haimchar", "Hajiganj", "Kachua", "Matlab Dakshin", "Shahrasti"],
        Lakshmipur: ["Lakshmipur Sadar", "Ramganj", "Raipur", "Ramgati", "Kamalnagar"]
    },

    Khulna: {
        Khulna: ["Khulna Sadar", "Dacope", "Dumuria", "Batiaghata", "Koyra", "Phultala", "Rupsa", "Terokhada"],
        Jessore: ["Jessore Sadar", "Bagherpara", "Jhikargacha", "Manirampur", "Sharsha", "Keshabpur"],
        Satkhira: ["Satkhira Sadar", "Debhata", "Kaliganj", "Shyamnagar", "Tala", "Kalaroa"],
        Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Kachua", "Morrelganj", "Mongla", "Rampal", "Sarankhola"],
        Meherpur: ["Meherpur Sadar", "Mujibnagar", "Gangni", "Shalikha"],
        Chuadanga: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
        Narail: ["Narail Sadar", "Lohagara", "Kalia"],
        Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
        Jhenaidah: ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur"],
        Kushtia: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Mirpur", "Kumarkhali"]
    },

    Rajshahi: {
        Rajshahi: ["Rajshahi Sadar", "Bagmara", "Godagari", "Paba", "Puthia", "Tanore", "Charghat"],
        Bogra: ["Bogra Sadar", "Dhunot", "Kahaloo", "Shibganj", "Sherpur", "Sariakandi", "Nandigram", "Gabtali", "Shajahanpur"],
        Pabna: ["Pabna Sadar", "Bera", "Ishwardi", "Santhia", "Atgharia", "Bhangura", "Chatmohar", "Faridpur", "Sujanagar"],
        Naogaon: ["Naogaon Sadar", "Atrai", "Raninagar", "Manda", "Dhamoirhat", "Patnitala", "Porsha", "Badalgachhi", "Sapahar", "Niamatpur", "Mohanpur"],
        Chapainawabganj: ["Chapainawabganj Sadar", "Shibganj", "Gomostapur", "Nachole"],
        Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
        Natore: ["Natore Sadar", "Baraigram", "Bagatipara", "Lalpur", "Gurudaspur", "Singra"],
        Sirajganj: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Shahjadpur", "Tarash", "Ullapara"]
    },

    Barishal: {
        Barishal: ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
        Patuakhali: ["Patuakhali Sadar", "Bauphal", "Kalapara", "Dashmina", "Rangabali", "Dumki", "Mirzaganj"],
        Bhola: ["Bhola Sadar", "Borhanuddin", "Charfassion", "Daulatkhan", "Lalmohan", "Tazumuddin", "Burhanuddin"],
        Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
        Pirojpur: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad"],
        Barguna: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltoli"]
    },

    Sylhet: {
        Sylhet: ["Sylhet Sadar", "Balaganj", "Bishwanath", "Fenchuganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar"],
        Habiganj: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Chunarughat", "Madhabpur", "Nabiganj"],
        Moulvibazar: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kulaura", "Rajnagar", "Sreemangal"],
        Sunamganj: ["Sunamganj Sadar", "Chhatak", "Dharampasha", "Dohalia", "Jagannathpur", "Shalla", "Bishwamvarpur", "Derai"]
    },

    Rangpur: {
        Rangpur: ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirganj", "Pirgachha", "Taraganj"],
        Dinajpur: ["Dinajpur Sadar", "Birampur", "Ghoraghat", "Kaharole", "Khansama", "Nawabganj", "Parbatipur", "Birganj"],
        Kurigram: ["Kurigram Sadar", "Bhurungamari", "Chilmari", "Nageswari", "Rajarhat", "Raomari", "Ulipur", "Phulbari"],
        Gaibandha: ["Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Sundarganj", "Saghata"],
        Lalmonirhat: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
        Nilphamari: ["Nilphamari Sadar", "Dimla", "Jaldhaka", "Saidpur", "Kishoreganj"],
        Thakurgaon: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
        Panchagarh: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"]
    },

    Mymensingh: {
        Mymensingh: ["Mymensingh Sadar", "Bhaluka", "Gaffargaon", "Trishal", "Muktagachha", "Nandail", "Phulpur", "Haluaghat"],
        Jamalpur: ["Jamalpur Sadar", "Bokshiganj", "Dewanganj", "Melandah", "Sarishabari", "Madarganj", "Islampur", "Jamalgonj"],
        Netrokona: ["Netrokona Sadar", "Atpara", "Khaliajuri", "Kendua", "Durgapur", "Kalmakanda", "Mohanganj", "Purbadhala"],
        Sherpur: ["Sherpur Sadar", "Nakla", "Nalita", "Jhenaigati", "Sreebardi"]
    }
};

const allDivisions = Object.keys(locationData);

const shopCategories = [
    "Car Service & Repair",
    "Motorcycle Service & Repair",
    "Truck/Commercial Vehicle Service",
    "Home Appliance Repair",
    "HV/AC & Cooling Specialist",
    "Car Detailing & Accessories",
];

const servicesData = {
    "Car Service & Repair": {
        "Engine & Drivetrain": ["Oil & Filter Change (Standard/Synthetic)", "Engine Diagnostics (Check Engine Light)", "Timing Belt/Chain Service", "Transmission Fluid Flush", "Clutch Replacement"],
        "Brakes & Suspension": ["Brake Pad & Rotor Replacement", "ABS System Diagnostics", "Shock/Strut Replacement", "Wheel Alignment & Balancing"],
        "Electrical Systems": ["Battery Testing & Replacement", "Alternator & Starter Repair", "Wiring & Fuse Repair", "Headlight/Taillight Restoration"],
        "Body & Glass": ["Minor Dent Removal", "Windshield Chip Repair", "Scratch Polish"],
    },
    "Motorcycle Service & Repair": {
        "Engine Maintenance": ["Regular Service & Tune-up", "Oil Change (Mineral/Semi/Full Synthetic)", "Carburetor Cleaning & Tuning", "Spark Plug Replacement"],
        "Drive & Transmission": ["Chain/Belt Adjustment & Replacement", "Clutch Plate Replacement", "Gearbox Oil Change"],
        "Brakes & Safety": ["Brake Shoe/Pad Replacement", "Cable Adjustments", "Suspension Fork Seal Replacement"],
        "Tires & Wheels": ["Puncture Repair", "Tire Replacement", "Wheel Balancing"],
    },
    "Truck/Commercial Vehicle Service": {
        "Heavy Duty Engine": ["Diesel Engine Overhaul", "Fleet Oil & Fluid Service", "Turbocharger Inspection", "EGR/DPF Emissions Service"],
        "Air & Hydraulic Brakes": ["Air Brake System Inspection & Repair", "Hydraulic Brake Service", "Brake Drum/Rotor Replacement"],
        "Drivetrain & Axles": ["Heavy-Duty Clutch Replacement", "Differential Repair", "Axle Alignment"],
        "Vehicle Body & Electrical": ["Trailer Wiring & Lighting Repair", "Cab Body Repair", "Lift Gate System Service"],
    },
    "Home Appliance Repair": {
        "Washing Machine": ["Drum/Bearing Replacement", "Motor Repair", "Drain Pump Service", "Control Panel Fixing"],
        "Refrigerator/Freezer": ["Gas Leak & Refill", "Compressor Replacement", "Thermostat & Defrost Heater Repair", "Door Seal Replacement"],
        "Oven & Stove": ["Burner Element Replacement (Electric)", "Gas Line Inspection", "Ignition System Repair"],
        "Dishwasher & Dryer": ["Drainage Unclogging", "Heating Element Repair", "Cycle Control Board Repair"],
    },
    "HVAC & Cooling Specialist": {
        "Residential AC": ["Split/Window AC Installation & Servicing", "Gas Refilling (R22/R410A)", "Coil Cleaning", "Compressor Repair"],
        "Commercial HVAC": ["Duct Cleaning & Installation", "Central AC Maintenance Contract", "Chiller System Repair"],
        "Refrigeration Units": ["Cold Room Service", "Ice Machine Repair", "Commercial Display Freezer Repair"],
    },
    "Car Detailing & Accessories": {
        "Premium Detailing": ["Full Interior Deep Cleaning", "Exterior Paint Correction", "Ceramic Coating Application", "Engine Bay Detailing"],
        "Accessories Installation": ["Audio System & Speaker Upgrade", "Dashcam & GPS Tracker Installation", "Seat Cover & Floor Mat Customization"],
        "Paint Protection Film (PPF)": ["Full Car PPF Installation", "Partial Panel Protection"],
    }
};

const weekendOptions = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const CustomDropdown = forwardRef(({ options, name, onChange, onBlur, isMulti = true, value, placeholder = "" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const initialSelected = isMulti
        ? (Array.isArray(value) ? value : [])
        : (value ? [value] : []);

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

    const handleToggle = () => {
        if (options.length > 0) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (item) => {
        let newSelected;
        if (isMulti) {
            newSelected = selectedItems.includes(item)
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item];
            onChange(newSelected);
        } else {
            newSelected = [item];
            setIsOpen(false);
            onChange(item);
        }
        setSelectedItems(newSelected);
    };

    const displayValue = isMulti
        ? selectedItems.length > 0 ? selectedItems.join(', ') : placeholder || `Select ${name}...`
        : selectedItems[0] || placeholder || `Select ${name}...`;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={`flex items-center justify-between w-full p-2 border rounded-lg cursor-pointer transition-colors ${options.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-orange-500 focus-within:border-orange-500'}`}
                onClick={handleToggle}
                onBlur={onBlur}
                tabIndex={0}
            >
                <span className={`truncate ${selectedItems.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
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
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            {isOpen && options.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto">
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

const uploadImageToImgbb = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const apiKey = "";

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`ImgBB upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data?.data?.url;
    } catch (error) {
        throw error;
    }
};

export default function MechanicShop() {
    const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            shop: {
                address: {
                    country: 'Bangladesh',
                }
            }
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');

    const selectedCategory = watch('shop.categories');

    const selectedDivision = watch('shop.address.division');
    const selectedDistrict = watch('shop.address.district');

    const districts = selectedDivision ? Object.keys(locationData[selectedDivision]) : [];
    const cities = (selectedDivision && selectedDistrict) ? locationData[selectedDivision][selectedDistrict] : [];

    useEffect(() => {
        if (!selectedDivision) {
            setValue('shop.address.district', '');
            setValue('shop.address.city', '');
        }
    }, [selectedDivision, setValue]);

    useEffect(() => {
        if (!selectedDistrict) {
            setValue('shop.address.city', '');
        }
    }, [selectedDistrict, setValue]);


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const url = await uploadImageToImgbb(file);
                setLogoUrl(url);
                setValue('shop.logo', url);
                toast.success("Logo uploaded successfully!");
            } catch (err) {
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
        toast.error("Please fill in all required fields and correct errors.");
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        const categoriesToProcess = data.shop.categories ? [data.shop.categories] : [];

        const services = {};
        for (const category of categoriesToProcess) {
            const categoryData = data.shop.vehicleTypes?.[category]?.categories;
            if (categoryData) {
                services[category] = {};
                for (const [subCategory, serviceArray] of Object.entries(categoryData)) {
                    const validServices = Array.isArray(serviceArray)
                        ? serviceArray.filter(service => service)
                        : [];

                    if (validServices.length > 0) {
                        services[category][subCategory] = validServices;
                    }
                }
            }
        }

        const shopData = {
            ...data.shop,
            categories: data.shop.categories ? [data.shop.categories] : null,
            vehicleTypes: services,
            contact: {
                ...data.shop.contact,
                email: data.businessEmail || null,
            },
            logo: logoUrl || null,
            ownerName: "User Name",
            ownerEmail: "user@email.com"
        };

        const payload = {
            userId: "temp-user-id",
            userEmail: "user@email.com",
            shop: shopData,
            certifications: data.certifications,
            socialLinks: data.socialLinks,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            toast.success("Mock API submission successful. (Check console)");
            console.log("Submitted Payload:", payload);
            reset();
            setLogoUrl('');
        } catch (error) {
            toast.error("Submission failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCategoriesArray = selectedCategory ? [selectedCategory] : [];

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
                                            <img src={logoUrl} alt="Shop Logo" className="h-20 object-contain border border-gray-200 p-1 rounded-md" />
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
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <Controller
                                        name="shop.categories"
                                        control={control}
                                        defaultValue={""}
                                        rules={{ required: "Please select your primary category" }}
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
                            </div>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-lg space-y-4 border border-gray-200">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-orange-600 mb-4">Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Division</label>
                                    <Controller
                                        name="shop.address.division"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Division is required" }}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={allDivisions}
                                                name="Division"
                                                placeholder="Select Division"
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                                isMulti={false}
                                            />
                                        )}
                                    />
                                    {errors.shop?.address?.division && <p className="text-sm text-red-500 mt-1">{errors.shop.address.division.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">District</label>
                                    <Controller
                                        name="shop.address.district"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "District is required" }}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={districts}
                                                name="District"
                                                placeholder={selectedDivision ? "Select District" : "Select Division first"}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                                isMulti={false}
                                            />
                                        )}
                                    />
                                    {errors.shop?.address?.district && <p className="text-sm text-red-500 mt-1">{errors.shop.address.district.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City / Upazila</label>
                                    <Controller
                                        name="shop.address.city"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "City/Upazila is required" }}
                                        render={({ field }) => (
                                            <CustomDropdown
                                                options={cities}
                                                name="City / Upazila"
                                                placeholder={selectedDistrict ? "Select City/Upazila" : "Select District first"}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                value={field.value}
                                                isMulti={false}
                                            />
                                        )}
                                    />
                                    {errors.shop?.address?.city && <p className="text-sm text-red-500 mt-1">{errors.shop.address.city.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <input type="text" {...register('shop.address.street', { required: "Street is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="Road/Area/Plot Number" />
                                    {errors.shop?.address?.street && <p className="text-sm text-red-500 mt-1">{errors.shop.address.street.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <input type="text" {...register('shop.address.country', { required: "Country is required" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" readOnly />
                                    {errors.shop?.address?.country && <p className="text-sm text-red-500 mt-1">{errors.shop.address.country.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input type="text" {...register('shop.address.postalCode')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                                    <input
                                        type="url"
                                        {...register('shop.address.mapUrl', { required: "Google Maps URL is required" })}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Paste the Google Maps 'Share' link or Embed URL"
                                    />
                                    {errors.shop?.address?.mapUrl && <p className="text-sm text-red-500 mt-1">{errors.shop.address.mapUrl.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
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

                            {selectedCategoriesArray.length === 0 && (
                                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-md">
                                    Please select your primary Category from the Shop Details section (left column) to list your services here.
                                </p>
                            )}

                            {selectedCategoriesArray.length > 0 && selectedCategoriesArray.map(category => {
                                const categoryServices = servicesData[category];
                                if (!categoryServices) return null;

                                return (
                                    <div key={category} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                                        <h3 className="text-lg font-bold text-gray-800 mb-3">{category}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(categoryServices).map(([subCategory, services]) => (
                                                <div key={subCategory} className="space-y-2">
                                                    <h4 className="text-md font-medium text-orange-700">{subCategory}</h4>
                                                    {services.map((service) => (
                                                        <div key={service} className="flex items-start">
                                                            <input
                                                                type="checkbox"
                                                                id={`${category}-${subCategory}-${service}`}
                                                                value={service}
                                                                {...register(`shop.vehicleTypes.${category}.categories.${subCategory}`)}
                                                                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                                                            />
                                                            <label
                                                                htmlFor={`${category}-${subCategory}-${service}`}
                                                                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
                                                            >
                                                                {service}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-8 w-full flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-fit text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Shop for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
