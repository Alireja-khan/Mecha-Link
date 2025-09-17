import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function HomeLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen justify-between">
            <Header></Header>
            <main className="pt-20">{children}</main>
            <Footer></Footer>
        </div>
    );
}
