import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
        alert("Analysis saved to history.");
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
                <ResultHeader data={data} />

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
                        <VerificationChecks data={data} />
                    </div>

                    <div className="lg:col-span-5">
                        <RecommendationsCard actions={data.recommendedActions} />
                    </div>
                </div>

                <LimitationsCard />
                <ResultActions onSave={handleSave} onAnalyzeAnother={handleAnalyzeAnother} />
            </main>

            <Footer />
        </div>
    );
};

export default Result;
