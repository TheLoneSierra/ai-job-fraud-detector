import {
    ShieldAlert,
    FileText,
    ScanSearch,
    BadgeCheck,
    GlobeLock,
    Languages,
} from "lucide-react";

const features = [
    {
        icon: ShieldAlert,
        title: "Scam Risk Scoring",
        description:
            "Instant risk score based on suspicious fraud indicators.",
    },
    {
        icon: FileText,
        title: "Text & Screenshot Analysis",
        description:
            "Deep scanning of screenshots and uploaded documents.",
    },
    {
        icon: ScanSearch,
        title: "AI Red Flag Detection",
        description:
            "Detects suspicious recruiter behavior and scam patterns.",
    },
    {
        icon: BadgeCheck,
        title: "Recruiter Verification",
        description:
            "Cross-check recruiter authenticity and domains.",
    },
    {
        icon: GlobeLock,
        title: "Phishing Detection",
        description:
            "Identifies malicious links and fake domains.",
    },
    {
        icon: Languages,
        title: "Language Analysis",
        description:
            "Analyzes urgency, manipulation, and scam wording.",
    },
];

const FeaturesSection = () => {
    return (
        <section className="px-4 py-24 md:px-8">
            <div className="mx-auto max-w-7xl">

                <h2 className="mb-16 text-center font-['Space_Grotesk'] text-4xl font-bold text-white">
                    Features
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="glass-card rounded-2xl border border-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
                            >
                                <Icon className="mb-5 text-cyan-300" size={32} />

                                <h3 className="mb-3 text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>

                                <p className="leading-7 text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;