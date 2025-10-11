
import serviceBanner from "../../../assets/images/service-banner.jpg";

export default function ServiceBanner() {
  return (
    <section className="container mx-auto px-6 pt-22 pb-10 flex flex-col-reverse md:flex-row items-center gap-12 font-roboto">
  {/* Left Content */}
  <div className="flex-1 flex flex-col gap-6">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
      Find All <span className="text-primary">Mechanic Shop</span> Here
    </h1>
    <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
      Choose your desired services and connect with experienced mechanics
      for hassle-free solutions — all in one place.
    </p>

    <div className="flex flex-wrap gap-4 mt-4">
      <button className="px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-secondary transition-all duration-300">
        Explore Services
      </button>
      <button className="px-6 py-3 border border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300">
        Learn More
      </button>
    </div>
  </div>

  {/* Right Image */}
  <div className="flex-1 relative">
    {/* Subtle blurred glow using brand tone */}
    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 -z-10"></div>

    <img
      src={serviceBanner.src}
      alt="Service Banner Illustration"
      className="w-full h-auto rounded-3xl shadow-xl object-cover"
    />
  </div>
</section>

  );
}
