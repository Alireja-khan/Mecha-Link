import { CheckCircle, Shield, Users, Zap } from "lucide-react";

const reasons = [
    {
        title: "Trusted & Reliable",
        description: "Join hundreds of satisfied clients who trust Mechalink for quality and consistency.",
        icon: <CheckCircle />,
    },
    {
        title: "Expert Team",
        description: "Our skilled professionals ensure your projects are handled with expertise and care.",
        icon: <Users />,
    },
    {
        title: "Fast & Efficient",
        description: "We deliver solutions quickly without compromising on quality or performance.",
        icon: <Zap />,
    },
    {
        title: "Secure & Protected",
        description: "Your data and projects are safe with our top-notch security standards.",
        icon: <Shield />,
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-20 font-roboto">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        Why Choose <span className="text-primary font-caveat">Mechalink</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-nunito-sans">
                        We provide unmatched services and solutions that help you achieve your business goals efficiently.
                    </p>
                </div>

                {/* Reasons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-4 mb-4 rounded-full bg-[#55338a]/10 text-primary">
                                {reason.icon}
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">{reason.title}</h3>
                            <p className="text-gray-600 text-sm">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
