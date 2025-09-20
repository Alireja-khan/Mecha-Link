"use client";
import React, { useState } from 'react';

const SettingsComponent = () => {
  // User data (would typically come from context or API)
  const [userData, setUserData] = useState({
    name: "Rahim Khan",
    email: "rahim.khan@example.com",
    phone: "+880 1712 345678",
    location: "Dhaka, Bangladesh",
    joined: "March 12, 2020",
    role: "Vehicle Owner",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    serviceReminders: true,
    promotions: false,
    securityAlerts: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataSharing: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  // Form states
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUserData, setTempUserData] = useState({ ...userData });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handle notification toggles
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle privacy changes
  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  // Handle security toggles
  const handleSecurityToggle = (key) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserData({ ...tempUserData });
    setIsEditing(false);
    setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    
    setTimeout(() => {
      setSaveMessage({ type: '', text: '' });
    }, 3000);
    
    setIsSaving(false);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setTempUserData({ ...userData });
    setIsEditing(false);
  };

  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-medium">{userData.name}</h3>
                <p className="text-gray-600">{userData.role}</p>
                <button className="mt-2 text-sm text-indigo-600 hover:underline">
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={tempUserData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-100"
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
                  className="w-full p-3 border rounded-lg disabled:bg-gray-100"
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
                  className="w-full p-3 border rounded-lg disabled:bg-gray-100"
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
                  className="w-full p-3 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <p className="text-gray-600">Manage how you receive notifications from MechaLink</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle('sms')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Get alerts on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationToggle('push')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Service Reminders</h4>
                  <p className="text-sm text-gray-600">Get reminders for upcoming vehicle services</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.serviceReminders}
                    onChange={() => handleNotificationToggle('serviceReminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Privacy Settings</h3>
            <p className="text-gray-600">Control your privacy and data sharing preferences</p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Profile Visibility</h4>
                <p className="text-sm text-gray-600 mb-3">Who can see your profile information</p>
                <div className="flex flex-wrap gap-3">
                  {['public', 'connections', 'private'].map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="profileVisibility"
                        checked={privacy.profileVisibility === option}
                        onChange={() => handlePrivacyChange('profileVisibility', option)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Show Email Address</h4>
                  <p className="text-sm text-gray-600">Allow others to see your email address</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showEmail}
                    onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Show Phone Number</h4>
                  <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.showPhone}
                    onChange={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Data Sharing for Improvement</h4>
                  <p className="text-sm text-gray-600">Help us improve our services by sharing anonymous usage data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy.dataSharing}
                    onChange={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <p className="text-gray-600">Manage your account security and access</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.twoFactorAuth}
                    onChange={() => handleSecurityToggle('twoFactorAuth')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Login Alerts</h4>
                  <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={() => handleSecurityToggle('loginAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Change Password</h4>
                <p className="text-sm text-gray-600 mb-3">Update your password regularly to keep your account secure</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                  Change Password
                </button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Active Sessions</h4>
                <p className="text-sm text-gray-600 mb-3">Manage devices that are logged into your account</p>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                  View Active Sessions
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">App Preferences</h3>
            <p className="text-gray-600">Customize your MechaLink experience</p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Language</h4>
                <select className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                  <option>English</option>
                  <option>Bengali</option>
                  <option>Arabic</option>
                  <option>Spanish</option>
                </select>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Theme</h4>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="light-theme"
                      name="theme"
                      defaultChecked
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="light-theme">Light</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="dark-theme"
                      name="theme"
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="dark-theme">Dark</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="auto-theme"
                      name="theme"
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="auto-theme">Auto</label>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Default View</h4>
                <select className="w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Dashboard</option>
                  <option>Vehicles</option>
                  <option>Services</option>
                </select>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Distance Units</h4>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="km-units"
                      name="units"
                      defaultChecked
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="km-units">Kilometers (km)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="miles-units"
                      name="units"
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="miles-units">Miles</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {saveMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {saveMessage.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 border-r border-r-gray-200 bg-gray-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;