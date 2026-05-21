import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="border-t border-white/10 bg-[#0b0e15] px-4 py-10 md:px-8"
        >
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">

                <div className="flex items-center gap-2">
                    <Shield className="text-blue-400" size={24} />

                    <h3 className="font-['Space_Grotesk'] text-xl font-bold text-blue-300">
                        hiresafeAI
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-cyan-300">
                        Privacy Notice
                    </a>

                    <a
                        href="mailto:aanchalpal2009@gmail.com"
                        className="hover:text-cyan-300"
                    >
                        Contact
                    </a>
                </div>

                <p className="text-sm text-gray-500">
                    Built with React + Gemini AI | AI-assisted risk analysis system
                </p>

                <p className="text-xs text-gray-600">
                    © 2026 hiresafeAI
                </p>
            </div>
        </motion.footer>
    );
};

export default Footer;