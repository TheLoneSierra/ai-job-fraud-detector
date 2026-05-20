import { useNavigate } from "react-router-dom";

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="px-4 py-24 md:px-8">
            <div className="glass-card relative mx-auto max-w-5xl overflow-hidden rounded-4xl border border-white/10 p-12 text-center">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"></div>

                <div className="relative z-10">

                    <h2 className="mb-6 font-['Space_Grotesk'] text-4xl font-bold text-white">
                        Secure Your Next Career Move
                    </h2>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-400">
                        Protect yourself from fake recruiters, phishing job offers,
                        and recruitment scams using AI-powered risk analysis.
                    </p>

                    <button
                        onClick={() => navigate("/analyze")}
                        className="primary-gradient-btn rounded-xl px-10 py-4 font-semibold text-white"
                    >
                        Try It For Free
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;