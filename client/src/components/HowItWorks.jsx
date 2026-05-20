import { useNavigate } from "react-router-dom";
import { Upload, BrainCircuit, FileSearch } from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "Upload",
        description:
            "Upload suspicious screenshots, PDFs, recruiter emails, or messages.",
    },
    {
        icon: BrainCircuit,
        title: "AI Analysis",
        description:
            "AI scans domains, wording patterns, urgency tactics, and scam indicators.",
    },
    {
        icon: FileSearch,
        title: "Risk Report",
        description:
            "Receive a structured risk analysis report with explanations.",
    },
];

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <section className="px-4 py-24 md:px-8">
            <div className="mx-auto max-w-7xl">

                <h2 className="mb-6 text-center font-['Space_Grotesk'] text-4xl font-bold text-white">
                    How It Works
                </h2>

                <p className="mx-auto mb-16 max-w-2xl text-center text-gray-400">
                    Our AI-powered detection system identifies suspicious recruitment
                    behavior in seconds.
                </p>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={index}
                                role="button"
                                tabIndex={0}
                                onClick={() => navigate("/analyze")}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        navigate("/analyze");
                                    }
                                }}
                                className="glass-card cursor-pointer rounded-3xl border border-white/10 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-cyan-400/20 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            >
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/10">
                                    <Icon className="text-cyan-300" size={32} />
                                </div>

                                <h3 className="mb-4 text-2xl font-semibold text-white">
                                    {step.title}
                                </h3>

                                <p className="leading-7 text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;