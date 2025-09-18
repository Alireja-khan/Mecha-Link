import {
  CalendarCheck,
  Clock,
  ListChecks,
  MapPin,
  Star,
  Car,
  Bell,
  Headphones,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Online Service Booking",
      desc: "Users can book services online with preferred date, time, and garage.",
      icon: CalendarCheck,
    },
    {
      title: "Real-Time Availability",
      desc: "See when mechanics or garages are available and avoid busy hours.",
      icon: Clock,
    },
    {
      title: "Service List & Categories",
      desc: "View separate categories with details for SUVs, Vans, Motorcycles, Cars, etc.",
      icon: ListChecks,
    },
    {
      title: "Geo-Location & Nearby Garage Finder",
      desc: "Find nearby garages integrated with Google Maps for directions.",
      icon: MapPin,
    },
    {
      title: "Customer Reviews & Ratings",
      desc: "Read feedback and ratings from other customers before booking.",
      icon: Star,
    },
    {
      title: "Service History & Vehicle Profile",
      desc: "Track past services, costs, and get personalized recommendations.",
      icon: Car,
    },
    {
      title: "Appointment Reminder",
      desc: "Get SMS/email reminders before bookings and notifications for next service.",
      icon: Bell,
    },
    {
      title: "24/7 Customer Support",
      desc: "Access live chat, call support, and roadside assistance anytime.",
      icon: Headphones,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto text-center px-4">
        {/* Heading and Description */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 font-urbanist">
          Our <span className="text-primary">Features</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins mb-16">
          Everything you need to keep your vehicle running smoothly
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Icon Container */}
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Card Content */}
                <h3 className="mt-4 text-xl font-bold font-urbanist">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 font-poppins">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Explore button */}
        <button className="mt-16 px-8 py-3 bg-primary text-white rounded-full font-poppins font-medium cursor-pointer transition-colors duration-300 hover:bg-secondary hover:shadow-lg">
          Explore more features
        </button>
      </div>
    </section>
  );
}