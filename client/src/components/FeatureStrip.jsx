import {
    BrainCircuit,
    FileSearch,
    ScanLine,
    ShieldCheck,
} from "lucide-react";

const items = [
    {
        icon: BrainCircuit,
        title: "AI Detection",
    },
    {
        icon: FileSearch,
        title: "PNG/TXT/JPG Analysis",
    },
    {
        icon: ScanLine,
        title: "OCR Extraction",
    },
    {
        icon: ShieldCheck,
        title: "Risk Scoring",
    },
];

const FeatureStrip = () => {
    return (
        <div className="glass-card mt-16 flex flex-wrap items-center justify-center gap-8 rounded-2xl p-6">
            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div
                        key={index}
                        className="flex items-center gap-3"
                    >
                        <Icon className="text-cyan-300" size={22} />

                        <span className="text-sm font-medium text-gray-300">
                            {item.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default FeatureStrip;