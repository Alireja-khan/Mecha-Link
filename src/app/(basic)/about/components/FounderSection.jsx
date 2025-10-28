import React from "react";
import { Star, Award, Zap, Calendar } from "lucide-react";

const FounderSection = () => {
  return (
    <section className="py-20">
      <div className="lg:container mx-auto px-6">
        <SectionHeader 
          title="Leadership Team"
          description="Passionate individuals driving innovation in the automotive service industry"
        />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <FounderCard />
          <FounderInfo />
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

const FounderCard = () => (
  <div className="border-2 border-neutral p-8 rounded-2xl shadow-md bg-base-200">
    <div className="flex items-center mb-6">
      <img
        src="https://i.ibb.co.com/PvHZ1B8w/Jhankar-Vai.jpg"
        alt="Founder"
        className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-neutral shadow"
      />
      <div>
        <h3 className="text-2xl font-semibold">Jhankar Mahbub</h3>
        <p className="text-primary">Founder & Lead Developer</p>
        <div className="flex mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
      </div>
    </div>
    <p className="text-base-content/60 mb-6">
      With a passion for technology and innovation, Alireja founded MechaLink to bridge the gap between skilled mechanics and customers seeking reliable services. His vision drives the project forward with excellence and dedication.
    </p>
    <SocialLinks />
  </div>
);

const SocialLinks = () => (
  <div className="flex space-x-3">
    <SocialIcon href="#" icon="facebook" />
    <SocialIcon href="#" icon="twitter" />
    <SocialIcon href="#" icon="github" />
  </div>
);

const SocialIcon = ({ href, icon }) => {
  const icons = {
    facebook: (
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    ),
    twitter: (
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    ),
    github: (
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    )
  };

  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center hover:bg-primary text-base-content/80 transition hover:animate-spin"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {icons[icon]}
      </svg>
    </a>
  );
};

const FounderInfo = () => (
  <div>
    <h3 className="text-2xl font-semibold mb-6 text-base-content">From Vision to Reality</h3>
    <p className="text-lg text-base-content/60 mb-6">
      Jhankar assembled a team of passionate developers and industry experts to bring MechaLink to life. His leadership has fostered a culture of innovation and excellence that continues to drive the platform forward.
    </p>
    <InfoItem icon={Award} text="10+ Years in Software Development" />
    <InfoItem icon={Zap} text="Expert in React & Next.js Ecosystems" />
    <InfoItem icon={Calendar} text="Founded MechaLink in 2023" />
  </div>
);

const InfoItem = ({ icon: Icon, text }) => (
  <div className="flex items-center text-base-content/60 mt-2">
    <Icon className="w-5 h-5 text-primary mr-2" />
    <span>{text}</span>
  </div>
);

export default FounderSection;