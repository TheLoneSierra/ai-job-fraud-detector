import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnalyzeHero from "../components/AnalyzeHero";
import UploadBox from "../components/UploadBox";
import TextInputBox from "../components/TextInputBox";
import WarningPanel from "../components/WarningPanel";
import FeatureStrip from "../components/FeatureStrip";
import { analyzeScamText, extractDocumentText } from "../services/analysisService";

const Analyze = () => {
    const [text, setText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileTextReady, setFileTextReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleFileChange = async (file) => {
        setSelectedFile(file || null);
        setFileTextReady(false);
        setError("");

        if (!file) {
            return;
        }

        try {
            setExtracting(true);
            const extractedText = (await extractDocumentText(file)).trim();

            if (!extractedText) {
                return;
            }

            setFileTextReady(true);
            setText((currentText) => {
                const trimmedCurrent = currentText.trim();

                if (!trimmedCurrent) {
                    return extractedText;
                }

                return `${trimmedCurrent}\n\n${extractedText}`;
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not extract text from this document.");
        } finally {
            setExtracting(false);
        }
    };

    const handleAnalyze = async () => {
        if (!text.trim() && !selectedFile) {
            setError("Paste text or upload a document before analyzing.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const result = await analyzeScamText({
                text: text.trim(),
                file: fileTextReady ? null : selectedFile,
            });

            if (!result || typeof result !== "object") {
                throw new Error("Invalid analysis response");
            }

            navigate("/result", {
                state: result,
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#10131a] text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                <AnalyzeHero />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="grid gap-6">
                            <UploadBox
                                file={selectedFile}
                                onFileChange={handleFileChange}
                                extracting={extracting}
                            />

                            <TextInputBox
                                text={text}
                                setText={setText}
                                loading={loading}
                                onAnalyze={handleAnalyze}
                                selectedFile={selectedFile}
                                extracting={extracting}
                            />

                            {error && (
                                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <WarningPanel />
                    </div>
                </div>

                <FeatureStrip />
            </main>

            <Footer />
        </div>
    );
};

export default Analyze;
