import { CheckCircle, ArrowRight } from "lucide-react";

const HowItWork = () => {
    const steps = [
        {
            title: "Sign Up",
            description: "Create your account quickly and securely to get started. Make sure to verify your email to unlock all features.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />
        },
        {
            title: "Select Service",
            description: "Browse through our wide range of services and choose the one that best fits your needs and goals for maximum efficiency.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />
        },
        {
            title: "Start Working",
            description: "Follow simple, guided steps to start your tasks, track your progress, and stay organized with helpful reminders.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />
        },
        {
            title: "Get Results",
            description: "Measure your outcomes with detailed insights, make improvements over time, and achieve your goals more effectively.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />
        }
    ];

    return (
        <section className="py-16 bg-gray-50 font-roboto">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        How To <span className="text-primary font-caveat">Work</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-nunito-sans">
                        Follow these simple steps to get started and achieve results quickly.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col items-start hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                            <ArrowRight className="w-5 h-5 text-primary mt-4 self-end" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWork;
