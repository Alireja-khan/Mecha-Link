import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function HomeLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen justify-between">
            <Header></Header>
            <main>{children}</main>
            <Footer></Footer>
        </div>
    );
}
