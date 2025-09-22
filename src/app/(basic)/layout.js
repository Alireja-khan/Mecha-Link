import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function BasicLayout({ children }) {
  return (
    <>
      <Header></Header>
      {children}
      <Footer></Footer>
    </>
  );
}
