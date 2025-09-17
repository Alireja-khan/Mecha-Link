import BlogSection from "./Components/Blog";
import FeatureSection from "./Components/FeatureSection";
import HowItWork from "./Components/HowToWork";
import Newsletter from "./Components/Newsletter";
import WhyChooseUs from "./Components/WhyChooseUs";


export default function Home() {

    return (
        <div className="">
            <WhyChooseUs />
            <HowItWork />
            <BlogSection />
            <Newsletter/>
            <FeatureSection/>
        </div>
    );

}
