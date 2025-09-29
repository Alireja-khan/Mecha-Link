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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="text-sm font-medium text-gray-600 mb-2">
              {item.label}
            </label>
            <select
              name={item.name}
              value={preferences[item.name]}
              onChange={handleChange}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Notification Preferences</h3>
        {[
          {
            name: "emailNotifications",
            label: "Email Notifications",
            desc: "Receive updates via email",
          },
          {
            name: "pushNotifications",
            label: "Push Notifications",
            desc: "Receive browser notifications",
          },
          {
            name: "smsNotifications",
            label: "SMS Notifications",
            desc: "Receive text message alerts",
          },
        ].map((item) => (
          <label
            key={item.name}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
            <input
              type="checkbox"
              name={item.name}
              checked={preferences[item.name]}
              onChange={handleChange}
              className="accent-blue-600"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
