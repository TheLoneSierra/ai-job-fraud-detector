import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const VerificationChecks = ({ data = {} }) => {
    const checks = [
        {
            title: "Domain Authenticity",
            status: data.extractedInfo?.email?.includes("@") ? "Found" : "Unknown",
            icon: data.extractedInfo?.email ? CheckCircle2 : XCircle,
            color: data.extractedInfo?.email ? "text-cyan-300" : "text-red-400",
        },
        {
            title: "Company Mention",
            status: data.extractedInfo?.company ? "Found" : "Missing",
            icon: data.extractedInfo?.company ? CheckCircle2 : XCircle,
            color: data.extractedInfo?.company ? "text-cyan-300" : "text-red-400",
        },
        {
            title: "Suspicious Wording",
            status: data.riskLevel === "High" ? "High" : data.riskLevel === "Medium" ? "Medium" : "Low",
            icon: AlertTriangle,
            color: data.riskLevel === "High" ? "text-orange-300" : "text-cyan-300",
        },
    ];

    return (
        <div className="glass-card rounded-3xl p-6">
            <h2 className="mb-6 text-2xl font-semibold text-white">Verification Checks</h2>
            <div className="space-y-4">
                {checks.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex items-center justify-between rounded-2xl bg-[#1d2027] p-4">
                            <div className="flex items-center gap-3">
                                <Icon className={item.color} />
                                <span className="text-white">{item.title}</span>
                            </div>
                            <span className={`font-semibold ${item.color}`}>{item.status}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VerificationChecks;
