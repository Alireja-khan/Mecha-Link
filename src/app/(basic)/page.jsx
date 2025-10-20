
import FeaturesSection from "../Components/FeatureSection";
import Newsletter from "../Components/Newsletter";
import ReviewSection from "../Components/Review";
import ServiceSec from "../Components/ServiceSec";
import WhyChooseUs from "../Components/WhyChooseUs";
import HowItWork from "../Components/HowItWork";
import HeroSection from "../Components/HeroSection";
import Map from "../Components/Map";
import BlogSection from "./blogs/page";


export default function Home() {
    

    return (
        <>
            <HeroSection />
            <ServiceSec />
            <FeaturesSection />
            <WhyChooseUs />
            <HowItWork />
            <ReviewSection />
            <Map />
            <BlogSection />
            <Newsletter />
            
        </>
    );

}


// bg-[#2A2D38]