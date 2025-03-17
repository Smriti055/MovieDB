import { Star, Trophy } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function TopRated() {
    const API_KEY = "68ca6900766065d0046fe2f6c2061a86";
    const [movies, setMovie] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
                const data = await res.json();
                setMovie(data.results || []);
            } catch (error) {
                console.log("error fetching top-rated movies", error);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="w-full bg-black mx-auto px-4 py-8">
            {/* Title Section */}
            <motion.div
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.5 }}
                className="flex items-center gap-3 text-white mb-6"
            >
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">Top Rated Movies</h1>
            </motion.div>

            {/* Movie List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie, index) => {
    const rating = (movie.vote_average / 2).toFixed(1); // Convert 10 scale to 5 scale
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    return (
        <motion.div 
            key={movie.id} 
            className="bg-gray-800 rounded-xl shadow-md hover:scale-105 transition-transform p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }} // Stagger effect
        >
            <Link to={`/movie/${movie.id}`} className="block">
                <div className="relative">
                    <img className="w-full h-96 object-cover rounded-lg" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </div>
                <div className="mt-3 text-white">
                    <h2 className="text-xl font-semibold">{movie.title}</h2>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-2 text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} fill={i + 0.5 <= roundedRating ? "currentColor" : "none"} stroke="currentColor" className="w-5 h-5" />
                        ))}
                        <span className="text-gray-400 ml-2">{rating} / 5</span>
                    </div>

                    {/* Vote Count */}
                    <p className="text-gray-400 text-sm mt-1">
                        {movie.vote_count.toLocaleString()} votes
                    </p>
                </div>
            </Link>
        </motion.div>
    );
})}

            </div>
        </div>
    );
}

export default TopRated;
