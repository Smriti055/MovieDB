import { Film, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: "Home", path: "/" },
        { label: "Movies", path: "/movies" },
        { label: "Top Rated", path: "/top-rated" },
        { label: "TV Shows", path: "/tvshows" },
        { label: "Coming Soon", path: "/coming-soon" },
    ];

    return (
        <motion.nav
            className="bg-yellow-700/90 text-white backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50 shadow-lg transition-all duration-300"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="container mx-auto px-4 relative">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                    >
                        <Film className="w-8 h-8 text-yellow-500" />
                        <motion.span
                            className="text-xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                        >
                            MovieDB
                        </motion.span>
                    </Link>

                    {/* Desktop & Tablet Navigation */}
                    <div className="hidden sm:flex items-center gap-4 md:gap-6">
                        <Search />
                        <div className="flex items-center gap-4 md:gap-6 font-semibold text-md">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`hover:text-black transition-colors px-2 py-1 rounded-lg ${
                                        location.pathname === item.path
                                            ? "text-black"
                                            : "text-white"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Only on Mobile */}
                    <button
                        className="sm:hidden text-white hover:text-gray-300 transition"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="absolute top-16 left-0 w-full bg-black/90 text-white py-6 shadow-lg rounded-b-lg z-[100]"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <Search />
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`text-lg font-medium hover:text-yellow-400 transition px-3 py-2 rounded-lg ${
                                                location.pathname === item.path
                                                    ? "text-gray-500"
                                                    : "text-white"
                                            }`}
                                            onClick={() =>
                                                setIsMenuOpen(false)
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}

export default Navbar;
