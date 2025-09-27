import BlogSection from "../Components/Blog";
import FeaturesSection from "../Components/FeatureSection";
import Newsletter from "../Components/Newsletter";
import ReviewSection from "../Components/Review";
import ServiceSec from "../Components/ServiceSec";
import WhyChooseUs from "../Components/WhyChooseUs";
import HowItWork from "../Components/HowItWork";
import HeroSection from "../Components/HeroSection";


export default function Home() {

    return (
        <>
            <HeroSection />
            <ServiceSec />
            <FeaturesSection />
            <WhyChooseUs />
            <HowItWork />
            <ReviewSection />
            <BlogSection />
            <Newsletter />
        </>
    );

}


// bg-[#2A2D38]