import { Ban, Search, ShieldAlert } from "lucide-react";

const RecommendationsCard = ({ actions = [] }) => {
    const defaultActions = [
        "Avoid sharing personal documents.",
        "Verify recruiter through official website.",
        "Never pay registration fees.",
    ];

    const items = actions.length ? actions : defaultActions;
    const icons = [Ban, Search, ShieldAlert];

    return (
        <div className="glass-card rounded-3xl border-l-4 border-cyan-300 p-6">
            <h2 className="mb-6 text-2xl font-semibold text-cyan-300">Recommended Actions</h2>
            <div className="space-y-5">
                {items.map((item, index) => {
                    const Icon = icons[index] || ShieldAlert;
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <Icon className="mt-1 text-cyan-300" />
                            <p className="leading-7 text-gray-300">{item}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecommendationsCard;
