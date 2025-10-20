"use client";

import useUser from '@/hooks/useUser';
import { ActivityIcon, BriefcaseIcon, CalendarIcon, GlobeIcon, MailIcon, MapPinIcon, PhoneCall, ShieldIcon } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';

// --- Utility Functions ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return dateString;
    }
};

// --- Icon Wrappers ---
const Mail = (props) => (<MailIcon size={24} className='text-primary'></MailIcon>);
const Phone = (props) => (<PhoneCall size={24} className='text-primary'></PhoneCall>);
const MapPin = (props) => (<MapPinIcon size={24} className='text-primary'></MapPinIcon>);
const Briefcase = (props) => (<BriefcaseIcon size={24} className='text-primary'></BriefcaseIcon>);
const Calendar = (props) => (<CalendarIcon size={24} className='text-primary'></CalendarIcon>);
const Shield = (props) => (<ShieldIcon size={24} className='text-primary'></ShieldIcon>);
const Activity = (props) => (<ActivityIcon size={24} className='text-primary'></ActivityIcon>);
const Globe = (props) => (<GlobeIcon size={24} className='text-primary'></GlobeIcon>);

// --- Helper Components ---

const SectionHeader = ({ title, description }) => (
    <div className="text-center mb-12 mt-8">
        <h2 className="text-3xl font-extrabold text-base-content mb-2">{title}</h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
        {description && <p className="max-w-2xl mx-auto mt-3 text-base-content/60">{description}</p>}
    </div>
);


const ProfileDetail = ({ icon: Icon, label, value }) => (
    // Implemented Card Design with Hover Effects
    <div className="p-5 rounded-2xl bg-base-100 shadow-lg border border-base-300 transition duration-300 hover:shadow-xl hover:border-primary/50 flex items-start space-x-4">
        {/* Icon Container with Primary Accent */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg flex-shrink-0">
            <Icon className="text-primary" />
        </div>
        <div>
            {/* Label and Value Typography */}
            <div className="text-sm font-semibold uppercase text-base-content/60 tracking-widest">{label}</div>
            <div className="text-lg font-semibold text-base-content break-words">{value}</div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm ${status === 'active'
        ? 'bg-success/70 text-white'
        : 'bg-error/70 text-white'
        }`}>
        <span className={`w-2.5 h-2.5 mr-2 rounded-full ${status === 'active' ? 'bg-success' : 'bg-error'
            }`}></span>
        {status}
    </span>
);

// --- Skeleton Loader Component (Adapted for Circular Avatar) ---

const SkeletonCard = () => (
    <div className="p-5 rounded-2xl shadow-md border border-base-300 animate-pulse flex items-start space-x-4">
        <div className="w-10 h-10 bg-base-300 rounded-lg flex-shrink-0"></div>
        <div className='flex-1'>
            <div className="h-3 w-24 bg-base-300 mb-3 rounded-full"></div>
            <div className="h-5 w-4/5 bg-base-300 rounded"></div>
        </div>
    </div>
);

const ProfileSkeleton = () => (
    <div className="w-full bg-base-100 shadow-2xl rounded-2xl overflow-hidden min-h-screen">
        {/* Gradient Header Skeleton */}
        <div className="flex items-center justify-center bg-gradient-to-r from-primary via-primary-focus to-secondary h-60 md:h-80 relative animate-pulse">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

            {/* Circular Avatar Placeholder */}
            <div className="z-50 absolute -bottom-24">
                <div className="h-64 w-64 md:h-88 md:w-88 rounded-xl bg-base-300 border-4 border-white shadow-2xl ring-4 ring-primary/30"></div>
            </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="pt-32 p-6 md:p-10 mt-24">
            <div className="text-center mb-10 animate-pulse">
                <div className="h-10 w-64 bg-base-300 mx-auto mb-3 rounded-lg"></div>
                <div className="h-6 w-40 bg-primary/30 mx-auto rounded-full"></div>
                <div className="mt-4 flex justify-center space-x-4">
                    <div className="h-7 w-20 bg-base-200 rounded-full"></div>
                    <div className="h-7 w-24 bg-base-200 rounded-full"></div>
                </div>
            </div>

            {/* Bio Skeleton with left border */}
            <div className="max-w-3xl mx-auto mb-12 animate-pulse">
                <div className="p-6 md:p-8 rounded-2xl border-l-4 border-primary shadow-xl">
                    <div className="h-5 w-3/5 bg-base-300 mb-4 rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-base-300 rounded"></div>
                        <div className="h-4 w-11/12 bg-base-300 rounded"></div>
                        <div className="h-4 w-5/6 bg-base-300 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-12 mt-8 animate-pulse">
                <div className="h-7 w-60 bg-base-200 mx-auto mb-2 rounded"></div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
            </div>

            <div className="text-center mb-12 mt-8 animate-pulse">
                <div className="h-7 w-52 bg-base-200 mx-auto mb-2 rounded"></div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => <SkeletonCard key={index} />)}
            </div>
        </div>
    </div>
);


// --- Main Component ---
const Profile = () => {
    // NOTE: useUser hook is assumed to fetch the logged-in user data
    const { user: originalUser, isLoading: originalIsLoading } = useUser();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate a small delay for the skeleton loader to be visible, even if data loads fast
    useEffect(() => {
        if (!originalIsLoading) {
            const delay = 500;
            const timer = setTimeout(() => {
                setUser(originalUser);
                setIsLoading(false);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [originalUser, originalIsLoading]);

    const userData = useMemo(() => {
        if (!user) return null;

        const placeholderImageUrl = 'https://placehold.co/160x160/FFA500/FFFFFF?text=PROFILE';

        return {
            name: user.name || 'User Name',
            jobTitle: user.jobTitle || 'N/A (Not Provided)',
            department: user.department || 'N/A (Not Provided)',
            profileImage: user.profileImage || placeholderImageUrl,
            email: user.email || 'N/A (Not Provided)',
            phone: user.phone || 'N/A (Not Provided)',
            location: user.location || 'N/A (Not Provided)',
            bio: user.bio || 'No biography provided.',
            role: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User',
            status: user.status || 'unknown',
            createdAt: user.createdAt ? formatDate(user.createdAt) : 'N/A',
            lastLoggedIn: user.lastLoggedIn ? formatDate(user.lastLoggedIn) : 'N/A',
            userId: user._id || 'N/A',
            updatedAt: user.updatedAt ? formatDate(user.updatedAt) : 'N/A',
            provider: user.provider || 'N/A',
            loginAttempts: user.loginAttempts !== undefined ? String(user.loginAttempts) : 'N/A',
        };
    }, [user]);

    if (isLoading || !userData) {
        return (
            <div className="min-h-screen flex justify-center font-sans">
                <div className="w-full lg:container p-4 md:p-8 mx-auto">
                    <ProfileSkeleton />
                </div>
            </div>
        );
    }

    // Define key styles for the layout to maintain overlap design
    const imageSizeClasses = "h-64 w-64 md:h-88 md:w-88";
    const bottomOffsetClass = "-bottom-24";
    const contentPaddingTop = "pt-32";

    return (
        <div className="min-h-screen lg:container mx-auto p-4 md:p-8 flex justify-center font-sans">
            <div className="w-full bg-base-100 shadow-2xl rounded-2xl overflow-hidden">

                {/* Profile Header and Image Area (Design Implementation) */}
                <div className="flex items-center justify-center bg-gradient-to-r from-primary via-primary-focus to-secondary  h-60 md:h-80 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    {/* Decorative shapes for visual interest */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                    {/* Profile Image/Avatar (Circular Overlap) */}
                    <div className={`z-50 absolute ${bottomOffsetClass}`}>
                        <img
                            className={`${imageSizeClasses} rounded-xl border-4 border-white object-cover shadow-2xl transition-transform duration-300 hover:scale-[1.02] ring-4 ring-primary/30`}
                            src={userData.profileImage}
                            alt={`${userData.name}'s profile`}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x160/FFA500/FFFFFF?text=PROFILE'; }}
                        />
                    </div>
                </div>

                {/* Profile Content Area (Padding starts below the image) */}
                <div className={`${contentPaddingTop} p-6 md:p-10 md:mt-24`}>

                    {/* Name, Title, and Badges */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-base-content">{userData.name}</h1>
                        <p className="text-xl font-semibold text-primary mt-2">{userData.jobTitle}</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <StatusBadge status={userData.status} />
                            <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-base-300 text-base-content/80 shadow-sm">
                                <Globe className="w-4 h-4 mr-2" />
                                {userData.provider}
                            </span>
                        </div>
                    </div>

                    {/* Bio Section (Highlighted Design) */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="p-6 md:p-8 rounded-2xl border-l-4 border-primary shadow-xl bg-base-100 transition duration-300 hover:shadow-2xl hover:bg-primary/5">
                            <h2 className="text-xl font-bold text-base-content/80 mb-3 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-primary" />
                                About {userData.name.split(' ')[0]}
                            </h2>
                            <p className="text-base-content/70 text-base leading-relaxed italic border-t pt-3 mt-3 border-base-300">{userData.bio}</p>
                        </div>
                    </div>

                    {/* Professional & Contact Information Section */}
                    <SectionHeader title="Professional & Contact Information" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <ProfileDetail icon={Briefcase} label="Department" value={userData.department} />
                        <ProfileDetail icon={Shield} label="Role (System)" value={userData.role} />
                        <ProfileDetail icon={Mail} label="Email Address" value={userData.email} />
                        <ProfileDetail icon={Phone} label="Phone Number" value={userData.phone} />
                        <ProfileDetail icon={MapPin} label="Location" value={userData.location} />
                        <ProfileDetail icon={Activity} label="User ID" value={userData.userId} />
                    </div>

                    {/* System Activity & Metadata Section */}
                    <SectionHeader title="System Activity & Metadata" description={`Details about account creation and recent activity for ${userData.name.split(' ')[0]}`} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
                        <ProfileDetail icon={Calendar} label="Member Since" value={userData.createdAt} />
                        <ProfileDetail icon={Activity} label="Last Logged In" value={userData.lastLoggedIn} />
                        <ProfileDetail icon={Calendar} label="Last Updated" value={userData.updatedAt} />
                        <ProfileDetail icon={Shield} label="Login Attempts" value={userData.loginAttempts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;