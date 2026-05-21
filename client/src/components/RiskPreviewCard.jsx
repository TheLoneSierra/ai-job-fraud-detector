import { AlertTriangle, BadgeDollarSign, Flag } from "lucide-react";

const samplePreview = {
    id: "PREVIEW_001",
    score: 85,
    level: "High",
    confidence: "92%",
    items: [
        {
            icon: AlertTriangle,
            title: "Risk Summary",
            description: "Overall risk score and confidence based on message content.",
            style: "red",
        },
        {
            icon: BadgeDollarSign,
            title: "Top Highlight",
            description: "Key indicators like suspicious requests, urgent pressure, or payment asks.",
            style: "orange",
        },
        {
            icon: Flag,
            title: "What’s Included",
            description: "Detailed red flags, source type, and the strongest fraud signals.",
            style: "blue",
        },
    ],
};

const RiskPreviewCard = () => {
    const preview = (() => {
        try {
            const history = JSON.parse(localStorage.getItem("hiresafe_analysis_history") || "[]");

            if (history.length) {
                const latest = history[0];
                const riskScore = Number(latest.riskScore) || samplePreview.score;
                const riskLevel = latest.riskLevel || (riskScore > 75 ? "High" : riskScore > 45 ? "Medium" : "Low");
                const redFlags = Array.isArray(latest.redFlags) ? latest.redFlags : [];

                return {
                    id: latest.id || samplePreview.id,
                    score: riskScore,
                    level: riskLevel,
                    confidence: latest.confidence || samplePreview.confidence,
                    items: [
                        {
                            icon: AlertTriangle,
                            title: "Latest Summary",
                            description: latest.summary || "A summary of the main risk findings will appear here.",
                            style: riskLevel === "High" ? "red" : "orange",
                        },
                        {
                            icon: BadgeDollarSign,
                            title: "Top Flag",
                            description: redFlags[0] || "Key red flags and suspicious patterns will be highlighted.",
                            style: redFlags.length ? "orange" : "blue",
                        },
                        {
                            icon: Flag,
                            title: "Source",
                            description: latest.source || "Original text or upload source will be shown here.",
                            style: "blue",
                        },
                    ],
                };
            }
        } catch (error) {
            console.warn("Could not load saved preview data:", error);
        }

        return samplePreview;
    })();

    const getStyleClasses = (style) => {
        if (style === "red") {
            return "border-red-500/20 bg-red-500/10 text-red-400";
        }
        if (style === "orange") {
            return "border-orange-500/20 bg-orange-500/10 text-orange-300";
        }
        return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    };

    return (
        <div className="glass-card relative overflow-hidden rounded-3xl p-8 shadow-2xl animate-fade-up">

            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
                        Risk Report Preview
                    </h3>

                    <p className="text-sm text-gray-500">ID: {preview.id}</p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-cyan-400/30 text-cyan-300">
                    {preview.score}%
                </div>
            </div>

            <div className="space-y-4">
                {preview.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className={`flex gap-4 rounded-xl border p-4 ${getStyleClasses(item.style)}`}>
                            <Icon className="text-current" />
                            <div>
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                <p className="text-sm text-gray-300">{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RiskPreviewCard;
