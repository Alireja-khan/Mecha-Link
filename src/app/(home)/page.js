import BlogSection from "../Components/Blog";
import HowItWork from "../Components/HowToWork";
import WhyChooseUs from "../Components/WhyChooseUs";

export default function Home() {
    return (
        <div className="">
            <WhyChooseUs/>
            <HowItWork/>
            <BlogSection/>
        </div>
    );
}
