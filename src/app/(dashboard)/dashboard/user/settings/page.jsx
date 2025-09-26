"use client";
import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { User, Bell, Lock, Shield, Settings, CheckCircle, XCircle, Edit, Save, X, ChevronDown } from 'lucide-react';

const CustomDropdown = forwardRef(({ options, name, onChange, onBlur, isMulti = false, value: propValue }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialSelected = isMulti ? (Array.isArray(propValue) ? propValue : []) : (propValue ? [propValue] : []);
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
    setSelectedItems(isMulti ? (Array.isArray(propValue) ? propValue : []) : (propValue ? [propValue] : []));
  }, [propValue, isMulti]);

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

    if (onChange) {
      onChange({ target: { name, value: isMulti ? newSelected : newSelected[0] } });
    }
  };

  const displayValue = isMulti
    ? selectedItems.length > 0 ? selectedItems.join(', ') : `Select ${name}...`
    : selectedItems[0] || `Select ${name}...`;

  const textColorClass = selectedItems.length > 0 ? 'text-gray-700' : 'text-gray-500 italic';


  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:border-orange-500 focus-within:border-orange-500"
        onClick={handleToggle}
        onBlur={onBlur}
        tabIndex={0}
        ref={ref}
      >
        <span className={`text-sm ${textColorClass}`}>
          {displayValue}
        </span>
        <ChevronDown
          size={18}
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      <div className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out origin-top ${isOpen ? 'opacity-100 scale-y-100 max-h-60' : 'opacity-0 scale-y-75 max-h-0 pointer-events-none'}`}>
        <ul className="overflow-y-auto max-h-60">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 cursor-pointer transition-colors duration-150 text-sm 
                                ${selectedItems.includes(option) ? 'bg-orange-100 font-semibold text-orange-700' : 'text-gray-700 hover:bg-orange-50'}`}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer transition-transform duration-200">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200 peer-checked:bg-orange-600 transition-all duration-200"></div>
  </label>
);

const CustomRadio = ({ name, value, checked, onChange, label }) => (
  <label className="flex items-center space-x-2 cursor-pointer transition-opacity duration-200">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="hidden peer"
    />
    {/* Updated Custom radio circle design */}
    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-400 transition-all duration-150 ease-in-out peer-checked:border-orange-600">
      <div className={`w-2.5 h-2.5 rounded-full bg-orange-600 transition-transform duration-150 ease-in-out ${checked ? 'scale-100' : 'scale-0'}`} />
    </div>
    <span className="text-sm capitalize text-gray-700">{label}</span>
  </label>
);

const SettingsComponent = () => {
  const [userData, setUserData] = useState({
    name: "Rahim Khan",
    email: "rahim.khan@example.com",
    phone: "+880 1712 345678",
    location: "Dhaka, Bangladesh",
    joined: "March 12, 2020",
    role: "Vehicle Owner",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  });

  const [notifications, setNotifications] = useState({
    email: true, sms: false, push: true, serviceReminders: true, promotions: false, securityAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public", showEmail: false, showPhone: false, dataSharing: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false, loginAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'English', theme: 'light', defaultView: 'Dashboard', units: 'km',
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityToggle = (key) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserData({ ...tempUserData });
    setIsEditing(false);
    setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => { setSaveMessage({ type: '', text: '' }); }, 3000);
    setIsSaving(false);
  };

  const handleCancelEdit = () => {
    setTempUserData({ ...userData });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'privacy', label: 'Privacy', icon: <Lock size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold border-b border-gray-200 pb-3 mb-4 text-gray-800`}>Personal Information</h2>
            <div className="flex items-center space-x-6 pb-4 border-b border-gray-100">
              <img
                src={userData.avatar}
                alt={userData.name}
                className={`w-24 h-24 rounded-full object-cover border-2 border-orange-500`}
              />
              <div>
                <h3 className="text-xl font-medium text-gray-800">{userData.name}</h3>
                <p className="text-sm text-gray-500">{userData.role}</p>
                <button className={`mt-2 text-sm text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors`}>
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={tempUserData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-200 rounded-lg disabled:bg-gray-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors ${isEditing ? 'border-orange-400' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={tempUserData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-200 rounded-lg disabled:bg-gray-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors ${isEditing ? 'border-orange-400' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={tempUserData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-200 rounded-lg disabled:bg-gray-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors ${isEditing ? 'border-orange-400' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={tempUserData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border border-gray-200 rounded-lg disabled:bg-gray-100 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors ${isEditing ? 'border-orange-400' : 'border-gray-200'}`}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className={`px-5 py-2 flex items-center gap-1 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors`}
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className={`px-5 py-2 flex items-center gap-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors`}
                  >
                    {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-5 py-2 flex items-center gap-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors`}
                >
                  <Edit size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold border-b border-gray-200 pb-3 mb-4 text-gray-800`}>Notification Preferences</h2>
            <p className="text-gray-600">Manage how you receive notifications from MechaLink.</p>

            <div className="space-y-4">
              {[
                { key: 'email', title: 'Email Notifications', desc: 'Receive important updates via email' },
                { key: 'sms', title: 'SMS Notifications', desc: 'Receive text messages for urgent updates' },
                { key: 'push', title: 'Push Notifications', desc: 'Get alerts on your device' },
                { key: 'serviceReminders', title: 'Service Reminders', desc: 'Get reminders for upcoming vehicle services' },
                { key: 'promotions', title: 'Promotions & Offers', desc: 'Receive marketing communications' },
                { key: 'securityAlerts', title: 'Security Alerts', desc: 'Get notified about security events (recommended)' },
              ].map(item => (
                <div key={item.key} className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <ToggleSwitch
                    checked={notifications[item.key]}
                    onChange={() => handleNotificationToggle(item.key)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold border-b border-gray-200 pb-3 mb-4 text-gray-800`}>Privacy Settings</h2>
            <p className="text-gray-600">Control your profile visibility and data sharing preferences.</p>

            <div className="space-y-4">
              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Profile Visibility</h4>
                <p className="text-sm text-gray-500 mb-4">Who can see your profile information.</p>
                <div className="flex flex-wrap gap-4">
                  {['public', 'connections', 'private'].map(option => (
                    <CustomRadio
                      key={option}
                      name="profileVisibility"
                      value={option}
                      checked={privacy.profileVisibility === option}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      label={option}
                    />
                  ))}
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                <div>
                  <h4 className="font-medium text-gray-800">Show Email Address</h4>
                  <p className="text-sm text-gray-500">Allow others to see your email address.</p>
                </div>
                <ToggleSwitch
                  checked={privacy.showEmail}
                  onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                />
              </div>

              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                <div>
                  <h4 className="font-medium text-gray-800">Show Phone Number</h4>
                  <p className="text-sm text-gray-500">Allow others to see your phone number.</p>
                </div>
                <ToggleSwitch
                  checked={privacy.showPhone}
                  onChange={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                />
              </div>

              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                <div>
                  <h4 className="font-medium text-gray-800">Data Sharing for Improvement</h4>
                  <p className="text-sm text-gray-500">Help us improve our services by sharing anonymous usage data.</p>
                </div>
                <ToggleSwitch
                  checked={privacy.dataSharing}
                  onChange={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold border-b border-gray-200 pb-3 mb-4 text-gray-800`}>Security Settings</h2>
            <p className="text-gray-600">Manage your account security and access.</p>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                <div>
                  <h4 className="font-medium text-gray-800">Two-Factor Authentication (2FA)</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                </div>
                <ToggleSwitch
                  checked={security.twoFactorAuth}
                  onChange={() => handleSecurityToggle('twoFactorAuth')}
                />
              </div>

              <div className={`flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors`}>
                <div>
                  <h4 className="font-medium text-gray-800">Login Alerts</h4>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account.</p>
                </div>
                <ToggleSwitch
                  checked={security.loginAlerts}
                  onChange={() => handleSecurityToggle('loginAlerts')}
                />
              </div>

              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Change Password</h4>
                <p className="text-sm text-gray-500 mb-3">Update your password regularly to keep your account secure.</p>
                <button className={`px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm transition-colors`}>
                  Change Password
                </button>
              </div>

              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Active Sessions</h4>
                <p className="text-sm text-gray-500 mb-3">Manage devices that are currently logged into your account.</p>
                <button className={`px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 text-sm transition-colors`}>
                  View Active Sessions
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold border-b border-gray-200 pb-3 mb-4 text-gray-800`}>App Preferences</h2>
            <p className="text-gray-600">Customize your MechaLink experience.</p>

            <div className="space-y-4">
              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Language</h4>
                <CustomDropdown
                  options={['English', 'Bengali', 'Arabic', 'Spanish']}
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferencesChange}
                  isMulti={false}
                />
              </div>

              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Theme</h4>
                <div className="flex gap-4">
                  {['light', 'dark', 'auto'].map(theme => (
                    <CustomRadio
                      key={theme}
                      name="theme"
                      value={theme}
                      checked={preferences.theme === theme}
                      onChange={handlePreferencesChange}
                      label={theme}
                    />
                  ))}
                </div>
              </div>

              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Default View</h4>
                <CustomDropdown
                  options={['Dashboard', 'Vehicles', 'Services']}
                  name="defaultView"
                  value={preferences.defaultView}
                  onChange={handlePreferencesChange}
                  isMulti={false}
                />
              </div>

              <div className={`p-5 border border-gray-200 rounded-xl`}>
                <h4 className="font-medium mb-2 text-gray-800">Distance Units</h4>
                <div className="flex gap-4">
                  {[{ id: 'km', label: 'Kilometers (km)' }, { id: 'miles', label: 'Miles' }].map(unit => (
                    <CustomRadio
                      key={unit.id}
                      name="units"
                      value={unit.id}
                      checked={preferences.units === unit.id}
                      onChange={handlePreferencesChange}
                      label={unit.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-6 text-gray-500">Select a settings category from the menu.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and security options.</p>
        </header>

        {saveMessage.text && (
          <div className={`mb-6 p-4 flex items-center gap-3 rounded-xl shadow-md transition-opacity duration-300 ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            {saveMessage.type === 'success' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
            <span className="font-medium">{saveMessage.text}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className={`md:w-64 border-r border-gray-200 bg-gray-50/50`}>
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Settings Menu</h3>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 group
                                                ${activeTab === tab.id
                          ? 'bg-orange-100 text-orange-700 font-semibold'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                    >
                      <span className={`mr-3 transition-colors duration-200 ${activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex-1 p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;