import BlogSection from "../components/Blog";
import FeaturesSection from "../components/FeatureSection";
import Newsletter from "../components/Newsletter";
import ReviewSection from "../components/Review";
import ServiceSec from "../components/ServiceSec";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWork from "../components/HowItWork";
import HeroSection from "../components/HeroSection";


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