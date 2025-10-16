// app/(dashboard)/dashboard/mechanic/settings/PreferencesSettings.jsx
import React from "react";
import { Bell, MessageCircle, Mail, Globe, Palette, Calendar } from "lucide-react";

export default function PreferencesSettings({ preferences, setPreferences }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="space-y-8">
      {/* General Preferences */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-base-content pb-2 border-b border-base-300">
          General Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              name: "language",
              label: "Language",
              icon: Globe,
              options: [
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
              ],
            },
            {
              name: "timezone",
              label: "Timezone",
              icon: Globe,
              options: [
                { value: "UTC", label: "UTC" },
                { value: "EST", label: "Eastern Time" },
                { value: "PST", label: "Pacific Time" },
                { value: "CET", label: "Central European" },
              ],
            },
            {
              name: "dateFormat",
              label: "Date Format",
              icon: Calendar,
              options: [
                { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
              ],
            },
            {
              name: "theme",
              label: "Theme",
              icon: Palette,
              options: [
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "system", label: "System" },
              ],
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex flex-col">
                <label className="text-sm font-medium text-base-content mb-2 flex items-center gap-2">
                  <Icon size={16} className="text-primary" />
                  {item.label}
                </label>
                <select
                  name={item.name}
                  value={preferences[item.name]}
                  onChange={handleChange}
                  className="p-3 border border-base-300 bg-base-100 text-base-content rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
                >
                  {item.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-base-content pb-2 border-b border-base-300">
          Notification Preferences
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              name: "emailNotifications",
              label: "Email Notifications",
              desc: "Receive service requests, customer messages, and system updates via email.",
              icon: Mail,
            },
            {
              name: "pushNotifications",
              label: "Push Notifications",
              desc: "Get instant browser notifications for new service requests and urgent messages.",
              icon: Bell,
            },
            {
              name: "smsNotifications",
              label: "SMS Notifications",
              desc: "Receive important alerts via text message for critical updates.",
              icon: MessageCircle,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <label
                key={item.name}
                className="flex items-center justify-between p-4 border border-base-300 rounded-xl bg-base-100 hover:bg-base-200 transition duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="text-primary" size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-base-content">{item.label}</div>
                    <div className="text-sm text-base-content/70">{item.desc}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name={item.name}
                  checked={preferences[item.name]}
                  onChange={handleChange}
                  className="w-5 h-5 accent-primary focus:ring-primary/50"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Business Hours Reminder */}
      <div className="bg-info/10 border border-info/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Bell className="text-info mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-base-content mb-2">
              Business Hours Setting
            </h4>
            <p className="text-sm text-base-content/70">
              Your business hours can be managed from your main shop profile page. 
              This helps customers know when you're available for services.
            </p>
            <button
              type="button"
              className="mt-3 text-info hover:text-info/80 font-medium text-sm"
              onClick={() => window.location.href = '/dashboard/mechanic/profile'}
            >
              Go to Shop Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}