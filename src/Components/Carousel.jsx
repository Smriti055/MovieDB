import { Link } from 'react-router-dom';
import { MoveLeft, MoveRight, Film, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Carousel({ movies }) {
    const [startIndex, setStartIndex] = useState(0);
    const [visibleMovies, setVisibleMovies] = useState(3); // Default for large screens

    // Adjust the number of visible movies based on screen size
    useEffect(() => {
        const updateMoviesPerView = () => {
            if (window.innerWidth < 640) {
                setVisibleMovies(1); // Mobile
            } else if (window.innerWidth < 1024) {
                setVisibleMovies(2); // Tablet
            } else {
                setVisibleMovies(3); // Desktop
            }
        };

        updateMoviesPerView(); // Initial check
        window.addEventListener('resize', updateMoviesPerView);
        return () => window.removeEventListener('resize', updateMoviesPerView);
    }, []);

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 1 >= movies.length - (visibleMovies - 1) ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setStartIndex((prev) => (prev === 0 ? movies.length - visibleMovies : prev - 1));
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Carousel Wrapper */}
            <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${startIndex * (100 / visibleMovies)}%)` }}
            >
                {movies.map((movie) => (
                    <motion.div
                        key={movie.id}
                        style={{ minWidth: `${100 / visibleMovies}%` }} // Dynamic width for responsiveness
                        className="p-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link
                            to={`/movie/${movie.id}`}
                            className="block bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="p-4 text-white">
                                <h3 className="text-lg font-bold md:text-xl">{movie.title}</h3>
                                <p className="text-xs md:text-sm text-gray-400">{movie.year}</p>

                                {/* Movie Overview */}
                                <p className="text-gray-300 mt-2 text-sm md:text-base line-clamp-2">
                                    {movie.overview}
                                </p>

                                {/* Movie Rating */}
                                <div className="flex items-center mt-2 text-yellow-400">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                                    <span className="text-sm md:text-lg">{movie.rating}</span>
                                </div>

                                {/* Movie Genres */}
                                <div className="flex flex-wrap mt-2">
                                    {movie.genre.length > 0 ? (
                                        movie.genre.map((g, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center bg-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                                            >
                                                <Film className="w-4 h-4 mr-1 text-yellow-400" />
                                                Genre ID: {g}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-xs">No genres available</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Navigation Buttons */}
            {movies.length > visibleMovies && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 md:p-4 rounded-full text-white hover:bg-gray-700 transition"
                    >
                        <MoveLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 p-3 md:p-4 rounded-full text-white hover:bg-gray-700 transition"
                    >
                        <MoveRight size={20} />
                    </button>
                </>
            )}
        </div>
    );
}

export default Carousel;
