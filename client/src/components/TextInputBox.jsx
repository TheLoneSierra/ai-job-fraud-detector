const TextInputBox = ({ text, setText, loading, onAnalyze, selectedFile }) => {
    return (
        <div className="glass-card mt-8 rounded-3xl p-6">
            <label className="mb-4 block text-sm uppercase tracking-widest text-cyan-300">
                Paste suspicious message
            </label>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious recruiter messages, emails, LinkedIn chats, or Telegram job offers..."
                disabled={loading}
                className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-[#191b23] p-5 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            />

            <p className="mt-3 text-sm text-gray-400">
                If you upload a file, you can also include optional text here.
            </p>

            {selectedFile && (
                <p className="mt-3 text-sm text-green-300">
                    Selected file will be included in the analysis.
                </p>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onAnalyze}
                    disabled={loading}
                    className="primary-gradient-btn rounded-xl px-8 py-3 font-semibold text-white disabled:opacity-50"
                >
                    {loading ? "Analyzing..." : "Analyze Scam Risk"}
                </button>
            </div>
        </div>
    );
};

export default TextInputBox;
