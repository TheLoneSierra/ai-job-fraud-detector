import { FileText, Clock3, Upload } from "lucide-react";

const ResultHeader = ({ data }) => {
    const sourceLabel = data?.source || (data?.sourceFile ? "Uploaded document" : "Text Input");
    const cache = data?.cache;
    const cacheLabel =
        cache?.status === "cache-first"
            ? "Loaded from cache"
            : `Intel cache: ${cache?.status}`;
    const reportDate = new Date().toLocaleString();

    return (
        <section className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
                    Scam Risk Analysis Report
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="rounded-full bg-[#272a31] px-4 py-2">
                        Risk: {data.riskLevel || "Unknown"}
                    </span>

                    <span className="flex items-center gap-2">
                        <FileText size={16} />
                        {sourceLabel}
                    </span>

                    <span className="flex items-center gap-2">
                        <Clock3 size={16} />
                        {reportDate}
                    </span>

                    <span className="flex items-center gap-2">
                        <Upload size={16} />
                        {data.sourceFile || "No attachment"}
                    </span>

                    {cache?.status && cache.status !== "miss" && (
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-200">
                            {cacheLabel}
                        </span>
                    )}
                </div>
            </div>

            <button className="primary-gradient-btn rounded-xl px-6 py-3 font-semibold text-white">
                Download Report
            </button>
        </section>
    );
};

export default ResultHeader;
