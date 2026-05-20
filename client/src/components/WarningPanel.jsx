import {
    AlertTriangle,
    ShieldAlert,
    BadgeDollarSign,
    MessageSquareWarning,
} from "lucide-react";

const warnings = [
    {
        icon: BadgeDollarSign,
        title: "Never pay interview fees",
        desc: "Legitimate companies never ask for upfront payment.",
        color: "text-orange-300",
    },
    {
        icon: ShieldAlert,
        title: "Verify recruiter domains",
        desc: "Always check if the email matches official company domains.",
        color: "text-blue-300",
    },
    {
        icon: MessageSquareWarning,
        title: "Telegram-only hiring is risky",
        desc: "Professional recruitment rarely happens only through messaging apps.",
        color: "text-cyan-300",
    },
    {
        icon: AlertTriangle,
        title: "High salary + no interview",
        desc: "Offers that sound too good are usually scams.",
        color: "text-red-400",
    },
];

const WarningPanel = () => {
    return (
        <div className="space-y-5">
            {warnings.map((warning, index) => {
                const Icon = warning.icon;

                return (
                    <div
                        key={index}
                        className="glass-card rounded-2xl border border-white/5 p-5"
                    >
                        <Icon className={`mb-4 ${warning.color}`} size={28} />

                        <h3 className="mb-2 text-lg font-semibold text-white">
                            {warning.title}
                        </h3>

                        <p className="leading-7 text-gray-400">
                            {warning.desc}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default WarningPanel;