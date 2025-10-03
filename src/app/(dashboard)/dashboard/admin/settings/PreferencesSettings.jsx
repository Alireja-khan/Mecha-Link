import React from "react";

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

      {/* General Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[
          {
            name: "language",
            label: "Language",
            options: ["en", "es", "fr", "de"],
          },
          {
            name: "timezone",
            label: "Timezone",
            options: ["UTC", "EST", "PST", "CET"],
          },
          {
            name: "dateFormat",
            label: "Date Format",
            options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
          },
          {
            name: "theme",
            label: "Theme",
            options: ["light", "dark", "system"],
          },
        ].map((item) => (
          <div key={item.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {item.label}
            </label>
            <select
              name={item.name}
              value={preferences[item.name]}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            >
              {item.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
          Notification Preferences
        </h3>
        <div className="grid grid-cols-1 gap-4"> {/* Stays single column for better readability */}
          {[
            {
              name: "emailNotifications",
              label: "Email Notifications",
              desc: "Receive updates, news, and promotional emails.",
            },
            {
              name: "pushNotifications",
              label: "Push Notifications",
              desc: "Receive immediate browser notifications for important events.",
            },
            {
              name: "smsNotifications",
              label: "SMS Notifications",
              desc: "Receive essential text message alerts on your mobile phone.",
            },
          ].map((item) => (
            <label
              key={item.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50/50 transition duration-150 cursor-pointer"
            >
              <div>
                <div className="font-semibold text-gray-800">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                name={item.name}
                checked={preferences[item.name]}
                onChange={handleChange}
                // Tailwind class for custom checkbox color
                className="w-5 h-5 accent-orange-500 focus:ring-orange-500/50"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}