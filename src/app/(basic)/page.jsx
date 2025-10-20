
import FeaturesSection from "../Components/FeatureSection";
import Newsletter from "../Components/Newsletter";
import ReviewSection from "../Components/Review";
import ServiceSec from "../Components/ServiceSec";
import WhyChooseUs from "../Components/WhyChooseUs";
import HowItWork from "../Components/HowItWork";
import HeroSection from "../Components/HeroSection";
import BlogSection from "../Components/BlogSection";
import MapWithSearch from "../Components/MapWithSearch";


export default function Home() {
    

    return (
        <>
            <HeroSection />
            <ServiceSec />
            <FeaturesSection />
            <WhyChooseUs />
            <HowItWork />
            <ReviewSection />
            <MapWithSearch />
            <BlogSection />
            <Newsletter />
        </>
    );

}


// bg-[#2A2D38]