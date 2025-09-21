import Image from "next/image";
import Link from "next/link";

export default function HeroModern() {
    return (
        <section className="relative  py-20 md:py-28 lg:py-32">
            <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 max-w-7xl">

                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        Connect with <span className="text-primary">Trusted Mechanics</span> <br className="hidden sm:block" /> Anytime, Anywhere
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                        MechaLink helps vehicle owners find verified mechanics, book services instantly,
                        and track repairs—all in one platform. Reliable. Fast. Hassle-free.
                    </p>

                    {/* Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/services">
                            <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-secondary transition-all duration-300 w-full sm:w-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Find a Mechanic
                            </button>
                        </Link>
                        <button className="border-2 border-primary text-primary hover:bg-accent px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-300 w-full sm:w-auto font-medium shadow-sm hover:shadow-md">
                            Become a Partner
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm">
                        <div className="flex items-center">
                            <div className="flex -space-x-3 mr-2">
                                {[
                                    "https://i.ibb.co/0yVKz028/pexels-olly-733872.jpg",
                                    "https://i.ibb.co/b5MfnjHK/pexels-newman-photographs-234743505-31040032.jpg",
                                    "https://i.ibb.co/whxJD9y2/pexels-olly-839586.jpg",
                                    "https://i.ibb.co/4nPGtgF2/pexels-behrouz-sasani-3568050-5636811-2.jpg"
                                ].map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`customer ${index + 1}`}
                                        className="h-8 w-8 rounded-full border-2 border-white object-cover"
                                    />
                                ))}
                            </div>
                            <span>20k+ happy customers</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div>Trusted by 1,000+ garages</div>
                    </div>

                </div>

                {/* Image / Illustration */}
                <div className="flex-1 relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-[1.02] transition-all duration-500">
                        <Image
                            src="https://i.ibb.co.com/1fnb83Qs/pexels-chevanon-1108101.jpg" // replace with your asset
                            alt="Mechanic working illustration"
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                            priority
                        />
                        {/* Overlay card */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 13h2l1 9h12l1-9h2M5 13l1-6h12l1 6M10 17h4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Live Booking</h4>
                                <p className="text-gray-600 text-sm">Instant mechanic availability</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            {/* <div className="absolute top-15 right-0 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl opacity-30 -z-10"></div> */}
        </section>
    );
}
