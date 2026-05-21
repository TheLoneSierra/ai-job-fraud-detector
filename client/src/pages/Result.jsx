import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResultHeader from "../components/ResultHeader";
import RiskScoreCard from "../components/RiskScoreCard";
import AISummaryCard from "../components/AISummaryCard";
import RedFlagsCard from "../components/RedFlagsCard";
import ExtractedInfoGrid from "../components/ExtractedInfoGrid";
import VerificationChecks from "../components/VerificationChecks";
import RecommendationsCard from "../components/RecommendationsCard";
import LimitationsCard from "../components/LimitationsCard";
import ResultActions from "../components/ResultActions";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const analysis = data?.data ? data.data : data;
    const [showSaveModal, setShowSaveModal] = useState(false);


    useEffect(() => {
        if (!data) {
            navigate("/analyze");
        }
    }, [data, navigate]);

    const handleSave = () => {
        if (!data) return;

        const savedHistory = JSON.parse(localStorage.getItem("hiresafe_analysis_history") || "[]");
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            riskScore: analysis.riskScore,
            riskLevel: analysis.riskLevel,
            summary: analysis.summary,
            extractedInfo: analysis.extractedInfo || {},
        };


        localStorage.setItem("hiresafe_analysis_history", JSON.stringify([newEntry, ...savedHistory]));
        setShowSaveModal(true);
    };

    const handleAnalyzeAnother = () => {
        navigate("/analyze");
    };

    if (!data) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#10131a] text-white">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
                <ResultHeader data={analysis} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <RiskScoreCard data={analysis} />
                    </div>


                    <div className="flex flex-col gap-8 lg:col-span-8">
                        <AISummaryCard summary={analysis.summary} />
                        <RedFlagsCard redFlags={analysis.redFlags} />

                    </div>
                </div>

                <div className="mt-8">
                    <ExtractedInfoGrid extractedInfo={analysis.extractedInfo || {}} />
                </div>





                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <VerificationChecks data={analysis} />
                    </div>

                    <div className="lg:col-span-5">
                        <RecommendationsCard actions={analysis.recommendedActions} />
                    </div>
                </div>

                <LimitationsCard />
                <ResultActions onSave={handleSave} onAnalyzeAnother={handleAnalyzeAnother} />
            </main>

            <Footer />

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070a11]/80 px-4 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-md rounded-3xl border border-cyan-300/20 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                                    <CheckCircle2 size={30} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-white">Analysis saved</h2>
                                    <p className="mt-1 text-sm text-gray-400">
                                        This report is now stored in your local history.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSaveModal(false)}
                                className="rounded-full border border-white/10 p-2 text-gray-400 transition hover:border-cyan-300/40 hover:text-cyan-300"
                                aria-label="Close saved analysis dialog"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-[#191b23] p-4">
                            <p className="text-sm text-gray-300">
                                You can open it later from History and compare it with future job offers.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowSaveModal(false)}
                                className="primary-gradient-btn rounded-xl px-6 py-3 font-semibold text-white"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Result;
