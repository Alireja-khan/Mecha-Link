import React from "react";
import Lottie from "lottie-react";
import storyAnimation from "../../../../../public/assets/ourStory/Welcome.json";

const StorySection = () => {
  return (
    <section className="lg:container mx-auto px-6 py-5 lg:py-20">
      <SectionHeader 
        title="Our Story"
        description="How a simple idea transformed into a revolutionary platform connecting car owners with trusted mechanics for seamless automotive services and peace of mind."
      />

      <div className="grid xl:grid-cols-2 gap-16 items-center">
        <div className="w-full lg:w-full lg:flex items-center justify-center">
          <Lottie
            animationData={storyAnimation}
            loop={true}
            className="h-80 md:h-[400px] lg:h-[500px] w-auto"
          />
        </div>
        <div className="text-base-content">
          <h3 className="text-2xl font-semibold mb-6">
            Bridging the Gap Between Mechanics and Customers
          </h3>
          <p className="text-lg leading-relaxed mb-6">
            MechaLink was founded in 2023 with a vision to transform the automotive service industry. We recognized that both mechanics and vehicle owners faced significant challenges in connecting and transacting efficiently.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our platform combines the best elements of modern technology with deep industry knowledge to create a seamless experience. From intuitive booking systems to secure payment processing, we've built every component with both mechanics and customers in mind.
          </p>
          <div className="p-6 rounded-xl border-l-4 border-primary bg-base-200 shadow-2xl">
            <p className="font-medium">
              "Our mission is to empower mechanics with better tools and provide customers with transparency, quality service, and peace of mind."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title, description }) => (
  <div className="text-center md:mb-16">
    <h2 className="text-4xl font-bold mb-4 text-base-content">{title}</h2>
    <div className="w-20 h-1 bg-primary mx-auto"></div>
    <p className="max-w-2xl mx-auto mt-4 text-base-content/60">
      {description}
    </p>
  </div>
);

export default StorySection;