import { FileText, Clock3, Upload } from "lucide-react";

const escapeText = (value) => {
    if (value === null || value === undefined) return "Not identified";
    if (typeof value === "string") return value.trim() || "Not identified";
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

const formatMultiline = (value) => {
    const str = escapeText(value);
    return String(str)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");
};

const ResultHeader = ({ data }) => {
    const sourceLabel = data?.source || (data?.sourceFile ? "Uploaded document" : "Text Input");
    const cache = data?.cache;
    const cacheLabel =
        cache?.status === "cache-first" ? "Loaded from cache" : `Intel cache: ${cache?.status}`;
    const reportDate = new Date().toLocaleString();

    const downloadReportPdf = async () => {
        const { default: jsPDF } = await import("jspdf");

        // In real deployments, dynamic imports can fail due to bundler splitChunks/base-path.
        // If anything goes wrong, we fall back to downloading a .txt report.



        const parts = [];
        parts.push("Scam Risk Analysis Report");
        parts.push(`Generated: ${reportDate}`);
        parts.push("");
        parts.push(`Risk Level: ${data?.riskLevel || "Unknown"}`);
        parts.push(`Risk Score: ${data?.riskScore ?? "Not available"}`);
        parts.push(`Confidence: ${data?.confidence || "Not available"}`);
        parts.push("");
        parts.push(`Source: ${sourceLabel}`);
        parts.push(`Attachment: ${data?.sourceFile || "No attachment"}`);
        if (cache?.status && cache.status !== "miss") {
            parts.push(`Cache: ${cacheLabel}`);
        }

        parts.push("");
        parts.push("AI Summary");
        parts.push(formatMultiline(data?.summary));

        parts.push("\nRed Flags Detected");
        const redFlags = Array.isArray(data?.redFlags) ? data.redFlags : [];
        if (redFlags.length) {
            redFlags.forEach((flag, i) => {
                parts.push(`- ${flag?.title || `Red flag ${i + 1}`}`);
                parts.push(`  ${formatMultiline(flag?.description || flag?.desc)}`);
            });
        } else {
            parts.push("No red flags identified.");
        }

        parts.push("\nExtracted Information");
        const extractedInfo = data?.extractedInfo || {};
        parts.push(formatMultiline(extractedInfo));

        parts.push("\nVerification Checks (Heuristic)");
        parts.push(
            formatMultiline({
                email: extractedInfo?.email ? "Found" : "Unknown/Missing",
                company: extractedInfo?.company ? "Found" : "Unknown/Missing",
                riskLevel: data?.riskLevel || "Unknown",
            })
        );

        parts.push("\nRecommended Actions");
        const actions = Array.isArray(data?.recommendedActions) ? data.recommendedActions : [];
        if (actions.length) {
            actions.forEach((a) => parts.push(`- ${formatMultiline(a)}`));
        } else {
            parts.push("Not available.");
        }

        const text = parts.join("\n");

        const pdf = new jsPDF({ unit: "pt", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 36;
        const lineHeight = 14;
        const fontSize = 10;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize);

        const maxWidth = pageWidth - margin * 2;
        const lines = pdf.splitTextToSize(text, maxWidth / (fontSize * 0.6));

        let y = margin + 20;
        lines.forEach((line) => {
            if (y > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage();
                y = margin + 20;
            }
            pdf.text(String(line), margin, y);
            y += lineHeight;
        });

        const safeDate = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
        pdf.save(`scam-risk-analysis-report-${safeDate}.pdf`);
    };

    return (
        <section className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-bold text-white">
                    Scam Risk Analysis Report
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="rounded-full bg-[#272a31] px-4 py-2">
                        Risk: {data?.riskLevel || "Unknown"}
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
                        {data?.sourceFile || "No attachment"}
                    </span>

                    {cache?.status && cache.status !== "miss" && (
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-200">
                            {cacheLabel}
                        </span>
                    )}
                </div>
            </div>

            <button
                type="button"
                onClick={downloadReportPdf}
                className="primary-gradient-btn rounded-xl px-6 py-3 font-semibold text-white"
            >
                Download Report
            </button>
        </section>
    );
};

export default ResultHeader;

