
import serviceBanner from "../../../assets/images/service-banner.jpg";

export default function ServiceBanner() {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${serviceBanner.src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>

      <div className="container relative z-10 flex flex-col items-center justify-center text-center text-white py-40 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase mb-6 tracking-wide">
          Find All Services Here
        </h1>
        <p className="text-lg md:text-xl font-medium max-w-2xl mb-8">
          Choose your desired services and connect with experienced mechanics
          for hassle-free solutions.
        </p>

        {/* CTA Button */}
        <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300">
          Explore Services
        </button>

      </div>
    </section>
  );
}
