import { Toaster } from "react-hot-toast";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function BasicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header></Header>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
      <Footer></Footer>
    </div>
  );
}
