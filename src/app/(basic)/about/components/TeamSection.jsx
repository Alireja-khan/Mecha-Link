import React from "react";
import { Globe } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Alireja Khan",
      role: "Team Leader & UI/UX Designer",
      image: "https://i.ibb.co.com/BK7jhQh5/Gemini-Generated-Image-ddddlp1lddlp1lddlp.png",
      featured: true,
      facebook_profile: "https://www.facebook.com/alirejaa.khan",
      github_profile: "https://github.com/Alireja-khan",
      linkedin_profile: "https://www.linkedin.com/in/alireja-khan/",
      portfolio: "https://ali-reja-4b7b7.web.app/",
    },
    {
      name: "Omar Faruk",
      role: "Full Stack Developer",
      image: "https://i.ibb.co.com/bMP4QbVX/Gemini-Generated-Image-i0r1rti0r1rti0r1.png",
      facebook_profile: "https://www.facebook.com/omarfaruk56305",
      github_profile: "https://github.com/omarfaruk-pro",
      linkedin_profile: "https://www.linkedin.com/in/omarfaruk56305",
      portfolio: "https://faruks-portfolio2.netlify.app/",
    },
    {
      name: "Abrar Karim Rupu",
      role: "Fronted Developer",
      image: "https://i.ibb.co.com/39GVXc3Q/Gemini-Generated-Image-z472a4z472a4z472.png",
      facebook_profile: "https://www.facebook.com/abrarkarim.rupu.3",
      github_profile: "https://github.com/rupu10",
      linkedin_profile: "https://www.linkedin.com/in/abrar-karim-rupu10/",
      portfolio: "https://abrar-karim-rupu-portfolio-ok39rkneg-rupu10s-projects.vercel.app/",
    },
    {
      name: "MD. Rahimul Haq",
      role: "Backend Engineer",
      image: "https://i.ibb.co.com/JjgLYt6d/IMG-20250927-214815.jpg",
      facebook_profile: "https://www.facebook.com/mdrhtahsin/",
      github_profile: "https://github.com/mdrahimultahsin",
      linkedin_profile: "https://www.linkedin.com/in/rahimultahsin/",
      portfolio: "https://rahimul-portfolio.vercel.app/",
    },
    {
      name: "Raheel Arfeen Rahat",
      role: "Frontend Developer",
      image: "https://i.ibb.co.com/5X6mGPm2/550733568-1845540119507626-4770195972697828670-n.png",
      facebook_profile: "https://www.facebook.com/RaheelArfeen",
      github_profile: "https://github.com/RaheelArfeen",
      linkedin_profile: "https://www.linkedin.com/in/Raheelarfeen/",
      portfolio: "https://raheelarfeen.com/",
    },
    {
      name: "MD. Shahan Al Munim",
      role: "Backend Engineer",
      image: "https://i.ibb.co.com/d0CJLhYw/formal-image.jpg",
      facebook_profile: "https://www.facebook.com/munim9munim",
      github_profile: "https://github.com/MMunim90",
      linkedin_profile: "https://www.linkedin.com/in/m-munim/",
      portfolio: "https://mmunim.netlify.app/",
    },
  ];

  return (
    <section id="team-section" className="py-20">
      <div className="lg:container mx-auto px-6">
        <SectionHeader 
          title="Our Team"
          description="Talented individuals working together to revolutionize automotive services"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((person, i) => (
            <TeamMember key={i} person={person} />
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

const TeamMember = ({ person }) => (
  <div className={`group bg-base-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-2 ${person.featured ? "md:order-first border-4 border-primary" : "border-2 border-neutral"}`}>
    <div className="h-100 p-3 overflow-hidden">
      <img
        src={person.image}
        alt={person.name}
        className="w-full h-full rounded-xl object-cover object-top"
      />
    </div>
    <div className="p-6 text-center relative">
      {person.featured && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Team Lead
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
      <p className="text-gray-400 mb-4">{person.role}</p>
      <SocialLinks person={person} />
    </div>
  </div>
);

const SocialLinks = ({ person }) => (
  <div className="flex justify-center items-center space-x-3">
    <SocialIcon href={person.facebook_profile} type="facebook" />
    <SocialIcon href={person.linkedin_profile} type="linkedin" />
    <SocialIcon href={person.github_profile} type="github" />
    <SocialIcon href={person.portfolio} type="portfolio" />
  </div>
);

const SocialIcon = ({ href, type }) => {
  const icons = {
    facebook: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 19h-3v-9h3v9zm-1.5-10.25c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.25 10.25h-3v-4.75c0-1.133-.022-2.591-1.578-2.591-1.578 0-1.818 1.231-1.818 2.503v4.838h-3v-9h2.879v1.233h.041c.401-.762 1.381-1.563 2.842-1.563 3.037 0 3.598 2 3.598 4.599v5.731z" />
      </svg>
    ),
    github: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    portfolio: <Globe size={24} />
  };

  return (
    <a href={href} target="_blank" className="cursor-pointer hover:text-primary transition">
      {icons[type]}
    </a>
  );
};

export default TeamSection;