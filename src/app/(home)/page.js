import Banner from "../Components/Banner";
import BlogSection from "../Components/Blog";
import FeaturesSection from "../components/FeatureSection";
import HowItWork from "../Components/HowToWork";
import Newsletter from "../components/Newsletter";
import WhyChooseUs from "../Components/WhyChooseUs";

export default function Home() {
    return (
        <div className="">
            <Banner></Banner>
            <WhyChooseUs/>
            <HowItWork/>
            <BlogSection/>
            <Newsletter/>
            <FeaturesSection/>
        </div>
    );
}
