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
      icon: <CalendarCheck className="h-6 w-6 text-white" />,
    },
    {
      title: "Real-Time Availability",
      desc: "See when mechanics or garages are available and avoid busy hours.",
      icon: <Clock className="h-6 w-6 text-white" />,
    },
    {
      title: "Service List & Categories",
      desc: "View separate categories with details for SUVs, Vans, Motorcycles, Cars, etc.",
      icon: <ListChecks className="h-6 w-6 text-white" />,
    },
    {
      title: "Geo-Location & Nearby Garage Finder",
      desc: "Find nearby garages integrated with Google Maps for directions.",
      icon: <MapPin className="h-6 w-6 text-white" />,
    },
    {
      title: "Customer Reviews & Ratings",
      desc: "Read feedback and ratings from other customers before booking.",
      icon: <Star className="h-6 w-6 text-white" />,
    },
    {
      title: "Service History & Vehicle Profile",
      desc: "Track past services, costs, and get personalized recommendations.",
      icon: <Car className="h-6 w-6 text-white" />,
    },
    {
      title: "Appointment Reminder",
      desc: "Get SMS/email reminders before bookings and notifications for next service.",
      icon: <Bell className="h-6 w-6 text-white" />,
    },
    {
      title: "24/7 Customer Support",
      desc: "Access live chat, call support, and roadside assistance anytime.",
      icon: <Headphones className="h-6 w-6 text-white" />,
    },
  ];

  return (
    <section className="bg-primary/20 py-16">
      <div className="container mx-auto text-center px-4">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Our <span className="font-caveat text-primary ">Features</span>
        </h2>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-nunito-sans mb-16">
          Everything you need to keep your vehicle running smoothly
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-2xl"
            >
              {/* Circle with Icon */}
              <div className="absolute -top-5 left-6 h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow">
                {feature.icon}
              </div>

              {/* Card Content */}
              <h3 className="mt-6 text-lg font-bold text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-primary underline"
              >
                See More
              </a>
            </div>
          ))}
        </div>

        {/* Explore button */}
        <button className="mt-10 px-6 py-2 bg-primary text-white rounded cursor-pointer">
          Explore more features
        </button>
      </div>
    </section>
  );
}
