import Image from "next/image";
import serviceBanner from "../../assets/images/service-banner.jpg";
import tools from "../../assets/images/tools-f.png";

export default function ServiceBanner() {
  return (
    <>
      <section
        className="bg-cover bg-center relative after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/80"
        style={{ backgroundImage: `url(${serviceBanner.src})` }}
      >
        <div className="container">
          <div className="text-center relative z-1 text-white pt-40 pb-30">
            <h1 className="text-5xl font-bold uppercase mb-4">
              find all services here
            </h1>
            <p className="text-xl font-medium">
              Choose your desire services and communicate with experienced
              mechanics
            </p>
            <Image src={tools} alt="Service Banner" height={200} width={200} className="w-50 h-50 mx-auto"/>
          </div>
        </div>
      </section>
    </>
  );
}
