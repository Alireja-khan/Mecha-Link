import Image from "next/image";

export default function HeroModern() {
    return (
        <section className="bg-gray-50 py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12 text-center lg:text-left">
                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row lg:items-center w-full gap-8 lg:gap-16">
                    {/* Title */}
                    <div className="flex-1">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                            Build & grow <br className="hidden sm:inline" /> with scalable tools
                        </h1>
                    </div>

                    {/* Buttons and Description */}
                    <div className="w-full lg:w-fit flex flex-col justify-center lg:justify-start gap-4 mt-6 lg:mt-0">
                        {/* Buttons */}
                        <div className="flex justify-center lg:justify-start gap-4">
                            <button className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition w-full sm:w-auto font-medium shadow-md">
                                Get Started
                            </button>
                            <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-xl hover:bg-orange-100 transition w-full sm:w-auto font-medium shadow-md">
                                Free Trial
                            </button>
                        </div>
                        {/* Description */}
                        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mt-4">
                            Founded by data experts, we create cutting-edge SaaS analytics platforms tailored for businesses of all sizes.
                        </p>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-full mt-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        <img
                            src="/banner-image.jpeg" // Placeholder for responsive example
                            alt="Hero"
                            className="w-full h-auto max-h-[300px] sm:max-h-[450px] object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
