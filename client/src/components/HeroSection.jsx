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
                        hiresafeAI uses AI-powered linguistic analysis and domain verification
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

                        <a
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-white/10 px-8 py-4 text-center text-white transition hover:bg-white/5"
                        >
                            View Demo
                        </a>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                        <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
                            Supported Platforms
                        </p>

                        <div className="flex gap-6 text-gray-500">
                            <a
                                href="mailto:aanchalpal2009@gmail.com"
                                className="hover:text-cyan-300 transition-colors"
                                aria-label="Email"
                                title="aanchalpal2009@gmail.com"
                            >
                                <MessageCircle />
                            </a>
                            <a
                                href="mailto:aanchalpal2009@gmail.com"
                                className="hover:text-cyan-300 transition-colors"
                                aria-label="Email"
                                title="aanchalpal2009@gmail.com"
                            >
                                <Mail />
                            </a>
                            <a
                                href="https://github.com/TheLoneSierra/"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-cyan-300 transition-colors"
                                aria-label="GitHub"
                                title="GitHub"
                            >
                                <span className="inline-flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.56-.3-5.25-1.29-5.25-5.74 0-1.27.45-2.3 1.19-3.11-.12-.3-.52-1.52.11-3.16 0 0 .97-.31 3.18 1.19a11 11 0 0 1 2.89-.39c.98 0 1.96.13 2.89.39 2.21-1.5 3.18-1.19 3.18-1.19.63 1.64.23 2.86.11 3.16.74.81 1.19 1.84 1.19 3.11 0 4.46-2.7 5.44-5.27 5.73.41.35.78 1.04.78 2.1v3.1c0 .31.21.67.8.56 4.57-1.53 7.85-5.85 7.85-10.95C23.5 5.74 18.27.5 12 .5z" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <RiskPreviewCard />
            </div>
        </section>
    );
};

export default HeroSection;