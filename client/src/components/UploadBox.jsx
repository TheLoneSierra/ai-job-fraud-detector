import { useRef } from "react";
import { UploadCloud } from "lucide-react";

const UploadBox = ({ file, onFileChange }) => {
    const inputRef = useRef(null);

    const handleBrowse = () => {
        inputRef.current?.click();
    };

    const handleChange = (event) => {
        const selected = event.target.files?.[0] || null;
        onFileChange(selected);
    };

    return (
        <div
            className="glass-card flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 p-8 text-center transition duration-300 hover:border-cyan-400/40"
            onClick={handleBrowse}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,application/pdf,text/plain,application/json"
                className="hidden"
                onChange={handleChange}
            />

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10">
                <UploadCloud className="text-cyan-300" size={40} />
            </div>

            <h2 className="mb-3 text-2xl font-semibold text-white">Drag & Drop Files</h2>

            <p className="mb-6 max-w-md text-gray-400">
                Upload suspicious screenshots, PDFs, recruiter emails, or offer letters for AI-powered scam detection.
            </p>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    handleBrowse();
                }}
                className="primary-gradient-btn rounded-xl px-8 py-3 font-semibold text-white"
            >
                Browse Files
            </button>

            {file && (
                <p className="mt-4 text-sm text-green-300">Selected: {file.name}</p>
            )}

            <p className="mt-5 text-sm text-gray-500">Supported formats: PNG, JPG, PDF, TXT</p>
        </div>
    );
};

export default UploadBox;
