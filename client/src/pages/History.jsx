import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const History = () => {
    const [history, setHistory] = useState(() =>
        JSON.parse(localStorage.getItem("hiresafe_analysis_history") || "[]"),
    );

    const handleDelete = (id) => {
        const updated = history.filter((entry) => entry.id !== id);
        setHistory(updated);
        localStorage.setItem("hiresafe_analysis_history", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-[#10131a] text-white">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
                <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#11151f]/80 p-8">
                    <h1 className="text-4xl font-bold text-white">Analysis History</h1>
                    <p className="text-gray-400">
                        Saved scam analysis results are stored locally in your browser.
                    </p>
                </div>

                {history.length === 0 ? (
                    <div className="glass-card rounded-3xl p-8 text-center text-gray-300">
                        No history saved yet. Perform an analysis and click "Save Analysis" to store your report.
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {history.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    layout
                                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="glass-card rounded-3xl p-6"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-widest text-gray-500">{entry.riskLevel} Risk</p>
                                            <h2 className="text-2xl font-semibold text-white">{entry.riskScore}%</h2>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-sm text-gray-400">
                                                {new Date(entry.timestamp).toLocaleString()}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(entry.id)}
                                                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                aria-label="Delete history entry"
                                            >
                                                <Trash2 className="h-5 w-5 transition group-hover:rotate-12" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-gray-300">{entry.summary || "No summary available."}</p>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {Object.entries(entry.extractedInfo || {}).map(([key, value]) => (
                                            <motion.div
                                                key={key}
                                                layout
                                                whileHover={{ y: -4 }}
                                                className="rounded-2xl bg-[#151a24] p-4 transition"
                                            >
                                                <p className="text-xs uppercase tracking-widest text-gray-500">{key}</p>
                                                <p className="mt-2 text-sm text-white">{value}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default History;
