"use client";
import React, { useState, useEffect } from "react";
import BannerSection from "./components/BannerSection";
import StorySection from "./components/StorySection";
import MissionVisionSection from "./components/MissionVisionSection";
import FeaturesSection from "./components/FeaturesSection";
import TechnologySection from "./components/TechnologySection";
import FounderSection from "./components/FounderSection";
import TeamSection from "./components/TeamSection";
import CTASection from "./components/CTASection";
import LoadingSkeleton from "./components/LoadingSkeleton"; // Import from separate file

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="">
      <BannerSection />
      <StorySection />
      <MissionVisionSection />
      <FeaturesSection />
      <TechnologySection />
      <FounderSection />
      <TeamSection />
      <CTASection />
    </div>
  );
};

export default AboutPage;