import React from "react";

export default function PrivacySettings({ privacy, setPrivacy }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacy((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Profile Visibility</h3>
        {["public", "private"].map((val) => (
          <label
            key={val}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name="profileVisibility"
              value={val}
              checked={privacy.profileVisibility === val}
              onChange={handleChange}
              className="accent-blue-600"
            />
            <div>
              <div className="font-medium capitalize">{val}</div>
              <div className="text-sm text-gray-500">
                {val === "public"
                  ? "Anyone can see your profile"
                  : "Only you can see your profile"}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Data & Privacy</h3>
        {[
          {
            name: "activityStatus",
            label: "Show Activity Status",
            desc: "Allow others to see when you're active",
          },
          {
            name: "dataSharing",
            label: "Data Sharing",
            desc: "Share anonymous usage data to improve services",
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
              checked={privacy[item.name]}
              onChange={handleChange}
              className="accent-blue-600"
            />
          </label>
        ))}
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Delete Account
        </button>
      </div>
    </div>
  );
}
