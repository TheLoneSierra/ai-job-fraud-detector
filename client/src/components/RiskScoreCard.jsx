const RiskScoreCard = ({ data = {} }) => {
    const score = typeof data.riskScore === "number" ? `${data.riskScore}%` : "0%";
    const level = data.riskLevel || "Unknown";
    const confidence = data.confidence || "Not available";
    const borderColor = level === "High" ? "border-red-500/30" : level === "Medium" ? "border-orange-400/30" : "border-cyan-400/30";

    return (
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-8 text-center">
            <div className={`mb-6 flex h-52 w-52 items-center justify-center rounded-full border-[10px] ${borderColor}`}>
                <div>
                    <h2 className="text-6xl font-bold text-white">{score}</h2>
                    <p className="mt-2 uppercase tracking-widest text-gray-400">{level} Risk</p>
                </div>
            </div>

            <p className="mb-2 text-lg text-gray-300">Scam Risk Score</p>
            <p className="text-sm text-gray-500">AI Confidence: {confidence}</p>
        </div>
    );
};

export default RiskScoreCard;
