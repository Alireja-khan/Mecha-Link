import serviceBanner from "../../assets/images/service-banner.jpg";

export default function ServiceBanner() {
  return (
    <>
      <section
        className="bg-cover bg-center h-[300px] relative after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/70"
        style={{ backgroundImage: `url(${serviceBanner.src})` }}
      >
        <div className="container">
          <div className="text-center relative z-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              find all services here
            </h1>
            <p className="text-lg text-white">
              Choose your desire services and communicate with experienced
              mechanics
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
