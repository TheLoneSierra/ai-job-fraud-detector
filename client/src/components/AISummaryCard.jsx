import { BrainCircuit } from "lucide-react";

const AISummaryCard = ({ summary = "No summary available." }) => {
    return (
        <div className="glass-card rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-3">
                <BrainCircuit className="text-cyan-300" />
                <h2 className="text-2xl font-semibold text-white">AI Summary</h2>
            </div>

            <p className="leading-8 text-gray-400">{summary}</p>
        </div>
    );
};

export default AISummaryCard;
