import React from "react";

const TechnologySection = () => {
  const technologies = [
    { name: "Next.js", description: "React framework for server-side rendering" },
    { name: "Node.js", description: "Runtime environment for backend services" },
    { name: "MongoDB", description: "NoSQL database for flexible data storage" },
    { name: "Firebase", description: "Authentication and real-time database" }
  ];

  return (
    <section className="py-20 text-base-content">
      <div className="lg:container mx-auto px-6">
        <SectionHeader 
          title="Our Technology"
          description="Built with cutting-edge technologies for performance, security, and scalability"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {technologies.map((tech, index) => (
            <TechCard key={index} name={tech.name} description={tech.description} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center text-primary font-semibold group">
            View Technical Documentation
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
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

const TechCard = ({ name, description }) => (
  <div className="p-6 bg-base-200 rounded-xl backdrop-blur-sm">
    <div className="text-2xl font-bold text-primary mb-2">
      {name}
    </div>
    <p className="text-base-content/60">
      {description}
    </p>
  </div>
);

export default TechnologySection;