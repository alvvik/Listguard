import Hero from "./components/Hero";
import Steps from "./components/Steps";
import Footer from "./components/Footer";
import Admins from "./components/Admins";
export default function Home() {
  return (
    <div>
      <Hero />
      <div className="p-6 flex flex-col gap-8">
        <Steps />
        <Admins />
      </div>
      <Footer />
    </div>
  );
}
