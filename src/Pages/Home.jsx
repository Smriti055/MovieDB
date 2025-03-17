import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../Components/Hero';
import { Award, Clock, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Carousel from '../Components/Carousel';

const API_KEY = "68ca6900766065d0046fe2f6c2061a86";
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function Home() {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const trendingRes = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
                const trendingData = await trendingRes.json();
                setTrendingMovies(trendingData.results.slice(0, 8).map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/fallback-image.jpg',
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
                    genre: movie.genre_ids.slice(0, 2),
                    rating: movie.vote_average.toFixed(1)
                })));

                const upcomingRes = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
                const upcomingData = await upcomingRes.json();
                setUpcomingMovies(upcomingData.results.slice(0, 8).map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/fallback-image.jpg',
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
                    genre: movie.genre_ids.slice(0, 2),
                    rating: movie.vote_average.toFixed(1)
                })));
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        fetchMovies();
    }, []);

    const items = [
        { icon: TrendingUp, label: "Trending", path: "/movies?sort-trending", color: "bg-yellow-500" },
        { icon: Star, label: "Top Rated", path: "/top-rated", color: "bg-purple-500" },
        { icon: Clock, label: "Coming Soon", path: "/coming-soon", color: "bg-green-500" },
        { icon: Award, label: "Awards", path: "/awards", color: "bg-red-500" },
    ];

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative">
                {/* Fixed Background Visibility on Small Screens */}
                <Hero className="bg-cover bg-center min-h-screen sm:min-h-[60vh]" />

                {/* Category Buttons */}
                <motion.div 
                    className="absolute bottom-5 left-1/5 transform -translate-x-1/2 flex flex-wrap gap-3 gap-y-3 justify-center px-4 w-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {items.map((category, index) => (
                        <motion.div 
                            key={index} 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                        >
                            <Link
                                to={category.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${category.color} bg-opacity-80 backdrop-blur-md text-sm md:text-base`}
                            >
                                <category.icon className="w-4 h-4 md:w-5 md:h-5" />
                                <span>{category.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Trending & Upcoming Movies */}
            <section className="w-full px-4 py-12 text-center space-y-8 bg-gray-900">
                {/* Trending Section */}
                <motion.div 
                    className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-base sm:text-lg md:text-2xl font-bold flex items-center justify-center gap-2 text-gray-300">
                        <TrendingUp className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
                        Trending Now
                    </h2>
                    <Carousel movies={trendingMovies} />
                </motion.div>

                {/* Coming Soon Section */}
                <motion.div 
                    className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-6xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-base sm:text-lg md:text-2xl font-bold flex items-center justify-center gap-2 text-gray-300">
                        <Clock className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
                        Coming Soon
                    </h2>
                    <Carousel movies={upcomingMovies} />
                </motion.div>
            </section>
        </div>
    );
}

export default Home;
