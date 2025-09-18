import React from "react";
import ProfileCard from "../../components/ProfileCard";

const mechanicProfile = {
    name: "John Doe",
    email: "john.doe@mechanic.com",
    phone: "+987654321",
    joined: "Jan 10, 2020",
    additionalInfo: "Specializes in engine repair",
};

export default function MechanicProfile() {
    return <ProfileCard role="Mechanic" profileData={mechanicProfile} />;
}
