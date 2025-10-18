
"use client";

import { ActivityIcon, BriefcaseIcon, CalendarIcon, GlobeIcon, MailIcon, MapPinIcon, PhoneCall, ShieldIcon, AlertTriangle, MessageSquare, User as UserIcon, LogIn } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// NOTE: useUser is a custom hook and is assumed to be available at '@/hooks/useUser'
import useUser from '@/hooks/useUser';

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
const User = (props) => (<UserIcon size={24} className='text-primary'></UserIcon>);
const LogInIcon = (props) => (<LogIn size={24} className='text-primary'></LogIn>);

// --- Helper Components ---
const SectionHeader = ({ title, description }) => (
  <div className="text-center mb-12 mt-12">
    <h2 className="text-3xl font-bold text-base-content mb-3">{title}</h2>
    <div className="w-20 h-1.5 bg-primary/70 mx-auto rounded-full"></div>
    {description && <p className="max-w-2xl mx-auto mt-3 text-base-content/60">{description}</p>}
  </div>
);

const ProfileDetail = ({ icon: Icon, label, value }) => (
  <div className="p-6 rounded-xl bg-base-100 shadow-md border border-base-200 transition duration-300 hover:shadow-lg hover:border-primary/50 flex items-center space-x-5">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl flex-shrink-0">
      <Icon className="text-primary" />
    </div>
    <div>
      <div className="text-xs font-bold uppercase text-base-content/60 tracking-widest">{label}</div>
      <div className="text-lg font-medium text-base-content break-words mt-1">{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status === 'active'
    ? 'bg-success/70 text-white shadow-sm'
    : 'bg-error/70 text-white shadow-sm'
    }`}>
    <span className={`w-2 h-2 mr-2 rounded-full ${status === 'active' ? 'bg-success' : 'bg-error'
      }`}></span>
    {status}
  </span>
);

// --- Skeleton Loader Component ---
const ProfileSkeleton = () => (
  <div className="w-full bg-base-100 shadow-2xl rounded-2xl overflow-hidden min-h-screen">
    {/* Header/Image Area */}
    <div className="flex items-center justify-center bg-gradient-to-r from-primary via-primary-focus to-secondary h-60 md:h-80 relative animate-pulse">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="z-50 absolute -bottom-24">
        <div className="h-64 w-64 md:h-88 md:w-88 rounded-xl bg-base-300 border-4 border-white shadow-2xl ring-4 ring-primary/30"></div>
      </div>
    </div>
    {/* Content Area */}
    <div className="pt-32 p-6 md:p-10 mt-24">
      {/* Name/Title/Badges Skeleton */}
      <div className="text-center mb-10 animate-pulse">
        <div className="h-10 w-64 bg-base-300 mx-auto mb-3 rounded-lg"></div>
        <div className="h-6 w-40 bg-primary/30 mx-auto rounded-full"></div>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="h-7 w-20 bg-base-200 rounded-full"></div>
          <div className="h-7 w-24 bg-base-200 rounded-full"></div>
        </div>
      </div>
      {/* Bio Skeleton */}
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
      {/* Section Header Skeleton */}
      <div className="text-center mb-12 mt-8 animate-pulse">
        <div className="h-7 w-60 bg-base-200 mx-auto mb-2 rounded"></div>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      {/* Detail Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[...Array(6)].map((_, index) =>
          <div key={index} className="p-5 rounded-2xl shadow-md border border-base-300 animate-pulse flex items-start space-x-4">
            <div className="w-10 h-10 bg-base-300 rounded-lg flex-shrink-0"></div>
            <div className='flex-1'>
              <div className="h-3 w-24 bg-base-300 mb-3 rounded-full"></div>
              <div className="h-5 w-4/5 bg-base-300 rounded"></div>
            </div>
          </div>
        )}
      </div>
      {/* The second detail grid would also be a skeleton here */}
      <div className="text-center mb-12 mt-8 animate-pulse">
        <div className="h-7 w-60 bg-base-200 mx-auto mb-2 rounded"></div>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
        {[...Array(4)].map((_, index) =>
          <div key={index} className="p-5 rounded-2xl shadow-md border border-base-300 animate-pulse flex items-start space-x-4">
            <div className="w-10 h-10 bg-base-300 rounded-lg flex-shrink-0"></div>
            <div className='flex-1'>
              <div className="h-3 w-24 bg-base-300 mb-3 rounded-full"></div>
              <div className="h-5 w-4/5 bg-base-300 rounded"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);


// --- Main Component ---
const DynamicProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const { user: loggedInUser } = useUser();
  const userId = params.userId;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  const placeholderImageUrl = 'https://placehold.co/160x160/FFA500/FFFFFF?text=PROFILE';


  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // NOTE: Assumes an API endpoint /api/users is set up
        const response = await fetch(`/api/users?id=${encodeURIComponent(userId)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user. Status: ${response.status}`);
        }
        const userData = await response.json();
        const finalUser = Array.isArray(userData) ? userData[0] : userData;
        if (!finalUser) {
          throw new Error("User data returned empty.");
        }
        setUser(finalUser);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const userData = useMemo(() => {
    if (!user) return null;

    // Data structure mapping from raw user object to display properties
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
      userId: user._id || user.userId || userId || 'N/A',
      updatedAt: user.updatedAt ? formatDate(user.updatedAt) : 'N/A',
      provider: user.provider || 'N/A',
      loginAttempts: user.loginAttempts !== undefined ? String(user.loginAttempts) : 'N/A',
    };
  }, [user, userId]);


  const handleMessageUser = async () => {
    if (!loggedInUser || !userData) {
      alert("Cannot message user: missing user data.");
      return;
    }

    if (loggedInUser.userId === userData.userId) {
      alert("Cannot message yourself.");
      return;
    }

    try {
      setLoadingChat(true);

      const targetUserId = userData.userId;
      const targetEmail = userData.email;
      const targetName = userData.name;
      const targetProfileImage = userData.profileImage;

      const loggedInUserId = loggedInUser._id || loggedInUser.userId;
      const loggedInEmail = loggedInUser.email;
      const loggedInName = loggedInUser.name;
      const loggedInProfileImage = loggedInUser.profileImage;

      const payload = {
        participants: [
          { userId: targetUserId, email: targetEmail, name: targetName, profileImage: targetProfileImage },
          { userId: loggedInUserId, email: loggedInEmail, name: loggedInName, profileImage: loggedInProfileImage },
        ],
      };

      // NOTE: Assumes an API endpoint /api/chats is set up for creating or finding chats
      const postRes = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!postRes.ok) {
        throw new Error(`Chat creation failed with status: ${postRes.status}`);
      }

      // Redirect to the messages dashboard
      const userRole = loggedInUser?.role?.toLowerCase() || 'user';
      router.push(`/dashboard/${userRole}/messages`);

    } catch (err) {
      console.error("❌ Error opening chat:", err);
      alert("Failed to open chat. Please try again.");
    } finally {
      setLoadingChat(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center font-sans">
        <div className="w-full xl:container p-4 md:p-8 mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <AlertTriangle className='w-12 h-12 text-error mb-4' />
        <h1 className='text-2xl font-bold'>User Profile Not Found</h1>
        <p className='text-base-content/70'>The profile for ID: **{userId || 'N/A'}** could not be loaded.</p>
        <button
          onClick={() => router.back()}
          className='mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors'
        >
          Go Back
        </button>
      </div>
    );
  }

  // Define key styles for the layout
  const imageSizeClasses = "h-64 w-64 md:h-88 md:w-88";
  const bottomOffsetClass = "-bottom-24";
  const contentPaddingTop = "pt-32";
  const isDefaultImage = userData.profileImage === placeholderImageUrl;


  return (
    <div className="min-h-screen xl:container mx-auto p-4 md:p-8 flex justify-center font-san">
      <div className="w-full bg-base-100 shadow-xl rounded-2xl overflow-hidden">

        {/* Profile Header and Image Area */}
        <div className="flex items-center justify-center bg-gradient-to-r from-primary via-primary-focus to-secondary h-60 md:h-80 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3"></div>

          {/* Profile Image/Avatar */}
          <div className={`z-50 absolute ${bottomOffsetClass}`}>
            <div className="relative">

              {isDefaultImage ? (
                // Default avatar placeholder (UserIcon)
                <div className={`${imageSizeClasses} rounded-xl border-4 border-white shadow-2xl transition-transform duration-300 ring-4 ring-primary/30 flex items-center justify-center bg-primary/20 text-primary`}>
                  <UserIcon className="w-2/3 h-2/3" />
                </div>
              ) : (
                // Actual profile image
                <img
                  className={`${imageSizeClasses} rounded-xl border-4 border-white object-cover shadow-2xl transition-transform duration-300 hover:scale-[1.02] ring-4 ring-primary/30`}
                  src={userData.profileImage}
                  alt={`${userData.name}'s profile`}
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImageUrl; }}
                />
              )}

              {/* Message User Button */}
              {loggedInUser && loggedInUser.userId !== userData.userId && (
                <button
                  onClick={handleMessageUser}
                  disabled={loadingChat}
                  className={`absolute -bottom-2 -right-2 transform translate-x-1/4 translate-y-1/4 p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 ring-4 ring-white/50 focus:outline-none focus:ring-primary/70
                                        ${loadingChat
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed animate-pulse'
                      : 'bg-primary text-white hover:bg-primary-focus hover:scale-105'
                    }`}
                >
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Area */}
        <div className={`${contentPaddingTop} p-6 md:p-10 md:mt-24`}>

          {/* Name, Title, and Badges */}
          <div className="text-center mb-10">
            <div className='flex flex-col items-center md:flex-row md:justify-center md:space-x-4 mb-2'>
              <h1 className="text-4xl md:text-5xl font-extrabold text-base-content order-1">{userData.name}</h1>
            </div>

            <p className="text-xl font-semibold text-primary mt-2">{userData.jobTitle}</p>

            <div className="mt-4 flex justify-center space-x-3">
              <StatusBadge status={userData.status} />
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-base-200 text-base-content/80 shadow-sm">
                <Globe className="w-4 h-4 mr-1" />
                {userData.provider}
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="p-6 md:p-8 rounded-2xl border-l-8 border-primary/70 shadow-xl bg-base-200/50 transition duration-300 hover:shadow-2xl hover:bg-base-200">
              <h2 className="text-xl font-bold text-base-content/80 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                About {userData.name.split(' ')[0]}
              </h2>
              <p className="text-base-content/70 text-base leading-relaxed italic pt-3 mt-3 border-t border-base-300">
                <MessageSquare className='w-4 h-4 inline mr-2 text-primary/70' />
                {userData.bio}
              </p>
            </div>
          </div>

          {/* Professional & Contact Information */}
          <SectionHeader title="Professional & Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <ProfileDetail icon={Briefcase} label="Department" value={userData.department} />
            <ProfileDetail icon={Shield} label="Role (System)" value={userData.role} />
            <ProfileDetail icon={Mail} label="Email Address" value={userData.email} />
            <ProfileDetail icon={Phone} label="Phone Number" value={userData.phone} />
            <ProfileDetail icon={MapPin} label="Location" value={userData.location} />
            <ProfileDetail icon={Activity} label="User ID" value={userData.userId} />
          </div>

          {/* System Activity & Metadata */}
          <SectionHeader title="System Activity & Metadata" description={`Details about account creation and recent activity for ${userData.name.split(' ')[0]}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
            <ProfileDetail icon={Calendar} label="Member Since" value={userData.createdAt} />
            <ProfileDetail icon={LogInIcon} label="Last Logged In" value={userData.lastLoggedIn} />
            <ProfileDetail icon={Calendar} label="Last Updated" value={userData.updatedAt} />
            <ProfileDetail icon={Shield} label="Login Attempts" value={userData.loginAttempts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProfilePage;