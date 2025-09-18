import BlogSection from "./Components/Blog";
import FeatureSection from "./Components/FeatureSection";
import HowItWork from "./Components/HowItWork";
import Newsletter from "./Components/Newsletter";
import WhyChooseUs from "./Components/WhyChooseUs";
import ReviewSection from "./Components/Review";
import HeroSection from "./Components/HeroSection";


export default function Home() {

    return (
        <div className="">
            <HeroSection />
            <FeatureSection />
            {/* <p>This is super dupper complex</p> */}
            <HowItWork />
            <WhyChooseUs />
            <ReviewSection />
            <BlogSection />
            <Newsletter />
        </div>
    );

}
