import { CheckCircle, Shield, Wrench, Zap, Clock, MapPin, DollarSign, ThumbsUp } from "lucide-react";

const reasons = [
    {
        title: "Verified Mechanics",
        description:
            "All our mechanics are background-checked and certified, ensuring trustworthy service every time."
        ,
        icon: <CheckCircle className="w-7 h-7" />,
    },
    {
        title: "Expert Repairs",
        description:
            "From routine maintenance to emergency breakdowns, our skilled experts handle it with care.",
        icon: <Wrench className="w-7 h-7" />,
    },
    {
        title: "Fast Response",
        description:
            "Book a mechanic instantly and get quick assistance whenever and wherever you need it.",
        icon: <Zap className="w-7 h-7" />,
    },
    {
        title: "Secure & Transparent",
        description:
            "Enjoy upfront pricing, secure payments, and full transparency with every service booked.",
        icon: <Shield className="w-7 h-7" />,
    },
    {
        title: "24/7 Availability",
        description:
            "Need help at midnight or early morning? Our mechanics are available round the clock.",
        icon: <Clock className="w-7 h-7" />,
    },
    {
        title: "Nearby Assistance",
        description:
            "Easily find mechanics closest to your location for faster service and reduced waiting time.",
        icon: <MapPin className="w-7 h-7" />,
    },
    {
        title: "Affordable Pricing",
        description:
            "Get competitive, upfront pricing without hidden costs. Pay only for what you need.",
        icon: <DollarSign className="w-7 h-7" />,
    },
    {
        title: "Customer Satisfaction",
        description:
            "Thousands of happy customers rely on MechaLink. Your satisfaction is our top priority.",
        icon: <ThumbsUp className="w-7 h-7" />,
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Why Choose{" "}
                        <span className="text-orange-500">MechaLink</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 mt-4">
                        A smarter, faster, and safer way to connect with trusted mechanics
                        near you.
                    </p>
                </div>

                {/* Reasons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 auto-rows-[minmax(200px,auto)]">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className={`
    group rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-500 hover:border-orange-500 flex flex-col items-center text-center relative overflow-hidden
    ${index === 0 ? "lg:col-span-2 lg:row-span-2 text-white border-0 justify-center" : ""} 
    ${index === 3 ? "lg:col-span-2" : ""} 
  `}
                            style={
                                index === 0
                                    ? {
                                        backgroundImage: "url('https://i.ibb.co/27q6jVgM/christian-buehner-Fd6osy-Vbt-G4-unsplash.jpg')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }
                                    : {}
                            }
                        >
                            {/* Overlay for readability */}
                            {index === 0 && (
                                <div className="absolute inset-0 bg-black/40 z-0"></div>
                            )}

                            {/* Icon */}
                            <div className="p-4 mb-6 rounded-full bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-inner z-10">
                                {reason.icon}
                            </div>

                            {/* Wrap text for max-width on first card */}
                            <div className={`${index === 0 ? "max-w-md" : "w-full"} z-10`}>
                                {/* Title */}
                                <h3 className="text-xl font-semibold mb-3  group-hover:text-orange-500 transition-colors">
                                    {reason.title}
                                </h3>

                                {/* Description */}
                                <p className=" text-sm leading-relaxed">
                                    {reason.description}
                                </p>
                            </div>

                            {/* Decorative underline */}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-orange-500 rounded-full group-hover:w-16 transition-all duration-300 z-10"></span>
                        </div>

                    ))}
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;
