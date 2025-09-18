import { CheckCircle, ArrowRight } from "lucide-react";

const HowToWork = () => {
    const steps = [
        {
            title: "Sign Up",
            description:
                "Create an account quickly and securely to get started with our platform.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />,
        },
        {
            title: "Choose a Service",
            description:
                "Browse through our services and select the one that fits your needs best.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />,
        },
        {
            title: "Start Working",
            description:
                "Follow simple steps to start your tasks and track your progress easily.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />,
        },
        {
            title: "Get Results",
            description:
                "See measurable outcomes and improve continuously with our analytics.",
            icon: <CheckCircle className="w-10 h-10 text-primary" />,
        },
    ];

    return (
        <section className="py-16 bg-gray-50 font-roboto">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-roboto-con">
                        How It{" "}
                        <span className="text-primary font-caveat inline-block">Works</span>
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
                            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-start hover:shadow-lg transition-all duration-300"
                        >
                            <div className="mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                            <div className="mt-auto">
                                <ArrowRight className="w-5 h-5 text-primary mt-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToWork;