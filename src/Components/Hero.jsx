import { Calendar, PlayIcon, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Hero() {
    const [movies, setMovies] = useState([]);
    const [currentMovie, setCurrentMovie] = useState(0);
    const API_KEY = "68ca6900766065d0046fe2f6c2061a86";
    const BASE_URL = "https://api.themoviedb.org/3";
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
                const data = await res.json();
                setMovies(data.results.slice(0, 3)); // Get first 3 movies
            } catch (error) {
                console.log(error);
            }
        };
        fetchMovies();
    }, []);

    // Auto-slide effect every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentMovie((prev) => (prev + 1) % movies.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [movies]);

    if (movies.length === 0) return <div className="text-white text-center mt-10">Loading...</div>;

    const movie = movies[currentMovie];

    return (
        <section className="relative h-[100vh] md:h-[90vh] w-full flex items-center justify-center text-white overflow-hidden">
            {/* Background Image with Framer Motion */}
            <motion.div
    key={movie.id}
    className="absolute inset-0 w-full h-full"
    initial={{ opacity: 0, scale: 1.1 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
>
    <img 
        src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} 
        alt={movie.title}
        className="w-full h-full object-cover"
    />
</motion.div>



            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl px-4 sm:px-6 md:px-12">
                <motion.div 
                    className="flex justify-center items-center space-x-4 sm:space-x-6 text-gray-300 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <div className="flex items-center gap-1">
                        <Star className="text-yellow-400 w-5 h-5" />
                        <span>{movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-5 h-5" />
                        <span>{movie.release_date}</span>
                    </div>
                </motion.div>

                <motion.h1 
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                >
                    {movie.title}
                </motion.h1>

                <motion.p 
                    className="mt-2 text-gray-300 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                >
                    {movie.overview.substring(0, 150)}...
                </motion.p>

                {/* Buttons */}
                <motion.div 
                    className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                >
                    <Link to={`/movie/${movie.id}`} className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-all">
                        <PlayIcon className="w-5 h-5" />
                        Watch Trailer
                    </Link>
                    <Link to={`/movie/${movie.id}`} className="px-6 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition-all">
                        More Info
                    </Link>
                </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 mb-10">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentMovie(index)}
                        className={`w-5 h-1 rounded-full transition-all ${currentMovie === index ? 'bg-yellow-500 w-5' : 'bg-gray-400'}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default Hero;
