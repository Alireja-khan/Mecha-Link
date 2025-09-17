import React from "react";
import ProfileCard from "../../components/ProfileCard";

const userProfile = {
    name: "Abby Cooper",
    email: "abby.cooper@example.com",
    phone: "+123456789",
    joined: "July 25, 2018",
    additionalInfo: "Lives in Portland, Oregon",
};

export default function UserProfile() {
    return <ProfileCard role="User" profileData={userProfile} />;
}