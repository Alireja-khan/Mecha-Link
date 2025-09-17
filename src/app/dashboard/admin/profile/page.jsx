import React from "react";
import ProfileCard from "../../components/ProfileCard";

const adminProfile = {
    name: "Admin Jane",
    email: "admin@example.com",
    phone: "+1122334455",
    joined: "Mar 5, 2019",
    additionalInfo: "Manages all dashboard users and analytics",
};

export default function AdminProfile() {
    return <ProfileCard role="Admin" profileData={adminProfile} />;
}
