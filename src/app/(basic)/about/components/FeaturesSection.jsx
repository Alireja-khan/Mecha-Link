import React from "react";
import { Shield, MapPin, CreditCard, MessageCircle, Clock, TrendingUp } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "Every mechanic on our platform undergoes a rigorous verification process to ensure quality and reliability."
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description: "Find the nearest available mechanics with our advanced mapping technology."
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Enjoy hassle-free transactions with multiple payment options and protection policies."
    },
    {
      icon: MessageCircle,
      title: "Real-Time Communication",
      description: "Chat directly with mechanics to discuss service details and get updates."
    },
    {
      icon: Clock,
      title: "Service Tracking",
      description: "Monitor your service request status from booking to completion in real-time."
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Mechanics can grow their business with our marketing tools and customer reach."
    }
  ];

  return (
    <section className="py-20">
      <div className="lg:container mx-auto px-6">
        <SectionHeader 
          title="Why Choose MechaLink?"
          description="Our platform offers unique advantages for both mechanics and customers"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title, description }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    <div className="w-20 h-1 bg-primary mx-auto"></div>
    <p className="max-w-2xl mx-auto mt-4 text-base-content/60">
      {description}
    </p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-xl hover:shadow-md transition border border-neutral bg-base-200">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default FeaturesSection;