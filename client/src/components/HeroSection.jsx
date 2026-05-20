import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, FileText, MessageCircle } from "lucide-react";
import RiskPreviewCard from "./RiskPreviewCard";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="mesh-bg px-4 py-16 md:px-8 md:py-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">

                <div className="space-y-8">
                    <h1 className="font-['Space_Grotesk'] text-4xl font-bold leading-tight text-white md:text-6xl">
                        Detect Fake Job Offers{" "}
                        <span className="text-cyan-300">
                            Before They Scam You.
                        </span>
                    </h1>

                    <p className="max-w-xl text-lg text-gray-400">
                        HireSafe AI uses AI-powered linguistic analysis and domain verification
                        to protect job seekers from sophisticated recruitment scams.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <button
                            onClick={() => navigate("/analyze")}
                            className="primary-gradient-btn flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold text-white"
                        >
                            Analyze Suspicious Offer
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={() => navigate("/analyze")}
                            className="rounded-xl border border-white/10 px-8 py-4 text-white transition hover:bg-white/5"
                        >
                            View Demo
                        </button>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
                            Supported Platforms
                        </p>

                        <div className="flex gap-6 text-gray-500">
                            <MessageCircle />
                            <Mail />
                            <FileText />
                        </div>
                    </div>
                </div>

                <RiskPreviewCard />
            </div>
        </section>
    );
};

export default HeroSection;