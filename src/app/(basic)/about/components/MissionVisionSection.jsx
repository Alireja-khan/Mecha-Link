import React from "react";
import { Target, Rocket } from "lucide-react";

const MissionVisionSection = () => {
  return (
    <section id="mission-section" className="py-20">
      <div className="lg:container mx-auto px-6">
        <SectionHeader title="Our Core Philosophy" />

        <div className="grid md:grid-cols-2 gap-10">
          <MissionCard 
            icon={Target}
            title="Our Mission"
            description="To create a reliable bridge between mechanics and customers by offering transparency, trust, and convenience in every service. We're committed to elevating the standard of automotive repairs through technology and community."
          />
          <MissionCard 
            icon={Rocket}
            title="Our Vision"
            description="To become the global leader in automotive service technology, redefining customer experience with innovation and care. We envision a world where finding quality automotive service is as easy as ordering food delivery."
          />
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <div className="w-20 h-1 bg-primary mx-auto"></div>
  </div>
);

const MissionCard = ({ icon: Icon, title, description }) => (
  <div className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition bg-base-200 border border-neutral">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-6">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="">{description}</p>
  </div>
);

export default MissionVisionSection;