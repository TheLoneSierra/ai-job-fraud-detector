const ResultActions = ({ onSave, onAnalyzeAnother }) => {
    return (
        <div className="mt-10 flex flex-wrap gap-4">
            <button
                onClick={onSave}
                className="primary-gradient-btn rounded-xl px-8 py-3 font-semibold text-white"
            >
                Save Analysis
            </button>

            <button
                onClick={onAnalyzeAnother}
                className="rounded-xl border border-cyan-300 px-8 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
            >
                Analyze Another
            </button>
        </div>
    );
};

export default ResultActions;
