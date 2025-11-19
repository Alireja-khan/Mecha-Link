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
            <label className="text-sm font-medium text-base-content mb-2">
              {item.label}
            </label>
            <select
              name={item.name}
              value={preferences[item.name]}
              onChange={handleChange}
              // Select styling updated for theme compatibility
              className="p-3 border border-base-300 bg-base-100 text-base-content rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
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
        {/* Header text and border updated */}
        <h3 className="text-xl font-bold text-base-content pb-2 border-b border-base-300">
          Notification Preferences
        </h3>
        <div className="grid grid-cols-1 gap-4">
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
              // Checkbox row updated for theme compatibility, hover effect uses base-300
              className="flex items-center justify-between p-4 border border-base-300 rounded-xl bg-base-100 hover:bg-base-200 transition duration-150 cursor-pointer"
            >
              <div>
                {/* Text colors updated */}
                <div className="font-semibold text-base-content">{item.label}</div>
                <div className="text-sm text-base-content/70">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                name={item.name}
                checked={preferences[item.name]}
                onChange={handleChange}
                // DaisyUI uses `toggle` or `checkbox` components, but for standard Tailwind fields, 
                // we use `accent-primary` for the checkbox color.
                className="w-5 h-5 accent-primary focus:ring-primary/50"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}