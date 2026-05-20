import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorks from "../components/HowItWorks";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#10131a] text-white">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorks />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Home;