import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="sticky top-0 z-50 border-b border-white/10 bg-[#10131a]/80 backdrop-blur-xl"
        >

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Shield className="text-blue-400" size={28} />

                    <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-blue-300">
                        HireSafe AI
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/"
                        className="text-sm uppercase tracking-widest text-gray-400 transition hover:text-cyan-300"
                    >
                        Home
                    </Link>

                    <Link
                        to="/analyze"
                        className="text-sm uppercase tracking-widest text-gray-400 transition hover:text-cyan-300"
                    >
                        Analyze
                    </Link>

                    <Link
                        to="/history"
                        className="text-sm uppercase tracking-widest text-gray-400 transition hover:text-cyan-300"
                    >
                        History
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-cyan-300 md:hidden"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="border-t border-white/10 bg-[#10131a] md:hidden"
                    >
                        <nav className="flex flex-col px-4 py-6">

                            <Link
                                to="/"
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-white/5 py-4 text-gray-300 transition hover:text-cyan-300"
                            >
                                Home
                            </Link>

                            <Link
                                to="/analyze"
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-white/5 py-4 text-gray-300 transition hover:text-cyan-300"
                            >
                                Analyze
                            </Link>

                            <Link
                                to="/history"
                                onClick={() => setMenuOpen(false)}
                                className="border-b border-white/5 py-4 text-gray-300 transition hover:text-cyan-300"
                            >
                                History
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Navbar;