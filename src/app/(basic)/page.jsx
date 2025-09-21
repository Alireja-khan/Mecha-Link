import BlogSection from "../Components/Blog";
import FeatureSection from "../Components/FeatureSection";
import HowItWork from "../Components/HowItWork";
import Newsletter from "../Components/Newsletter";
import ServiceSec from "../Components/ServiceSec";
import WhyChooseUs from "../Components/WhyChooseUs";
import ReviewSection from "../Components/Review";
import HeroSection from "../Components/HeroSection";


export default function Home() {

    return (
        <div className="">
            <HeroSection />
            <ServiceSec />
            <FeatureSection />
            <WhyChooseUs />
            <HowItWork />
            <ReviewSection />
            <BlogSection />
            <Newsletter />
        </div>
    );

}


// bg-[#2A2D38]