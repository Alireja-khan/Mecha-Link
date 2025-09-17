import BlogSection from "./Components/Blog";
import FeaturesSection from "./components/FeatureSection";
import HowItWork from "./Components/HowToWork";
import Newsletter from "./components/Newsletter";
import WhyChooseUs from "./Components/WhyChooseUs";
import './globals.css'

export default function Home() {

    return (
        <div className="">
            <WhyChooseUs />
            <HowItWork />
            <BlogSection />
            <Newsletter/>
            <FeaturesSection/>
        </div>
    );

}
