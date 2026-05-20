import { AlertTriangle, Globe, Siren } from "lucide-react";

const RedFlagsCard = ({ redFlags = [] }) => {
    const flags = redFlags.length
        ? redFlags
        : [
              {
                  icon: AlertTriangle,
                  title: "No red flags identified",
                  desc: "The AI did not detect major scam patterns.",
              },
          ];

    return (
        <div className="glass-card rounded-3xl p-6">
            <h2 className="mb-6 text-2xl font-semibold text-white">Red Flags Detected</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {flags.map((flag, index) => {
                    const Icon = flag.icon || AlertTriangle;
                    return (
                        <div key={index} className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                            <Icon className="mb-4 text-red-400" />
                            <h3 className="mb-2 font-semibold text-red-300">{flag.title}</h3>
                            <p className="text-sm leading-7 text-gray-300">{flag.description || flag.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RedFlagsCard;
