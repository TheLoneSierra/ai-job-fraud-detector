const LimitationsCard = () => {
    return (
        <div className="glass-card mt-10 rounded-3xl border border-red-500/10 bg-red-500/5 p-6">

            <h2 className="mb-4 text-xl font-semibold text-red-300">
                Confidence & Limitations
            </h2>

            <p className="leading-8 text-gray-400">
                This report is generated using AI-assisted risk analysis
                and common recruitment scam patterns. It should support —
                not replace — human judgment.
            </p>
        </div>
    );
};

export default LimitationsCard;