import { Film, Play, Star, ToggleLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_KEY = "68ca6900766065d0046fe2f6c2061a86";

function MovieList() {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search')?.toLowerCase() || ''; 
    const [isGridView, setIsGridView] = useState(true);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
            const data = await response.json();
            setMovies(data.results || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to load movies. Please try again later.");
            setLoading(false);
        }
    };

    const toggleView = () => setIsGridView(!isGridView);

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(search) ||
        (movie.genre_ids && movie.genre_ids.some(id => id.toString().includes(search)))
    );

    return (
        <div className="container mx-auto px-4 py-8 bg-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl text-white font-bold">
                    {search ? `Search Results for "${search}"` : 'Popular Movies'}
                </h1>
                <button
                    className="px-4 py-1 bg-blue-500 text-white rounded flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                    onClick={toggleView}
                >
                    <ToggleLeft className="h-5 w-5" />
                    <span>{isGridView ? 'Switch to List View' : 'Switch to Grid View'}</span>
                </button>
            </div>

            {loading ? (
                <div className="text-white text-center text-xl py-10">Loading...</div>
            ) : error ? (
                <div className="text-red-500 text-center text-xl py-10">{error}</div>
            ) : filteredMovies.length === 0 ? (
                <div className="text-white text-center text-xl py-10">
                    No results found for "{search}"
                </div>
            ) : (
                <div className={`grid ${isGridView ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                    {filteredMovies.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, x: -100 }} // Starts from the left
                            animate={{ opacity: 1, x: 0 }} // Slides in smoothly
                            transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
                            className={`p-4 ${!isGridView ? 'flex flex-col' : ''}`}
                        >
                            <Link
                                to={`/movie/${movie.id}`}
                                className="block bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                            >
                                {isGridView ? (
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-96 object-cover" />
                                ) : (
                                    <div className="p-4 text-white">
                                        <h3 className="text-xl font-bold">{movie.title}</h3>
                                        <p className="text-sm text-gray-400">{movie.release_date}</p>

                                        <div className='flex items-center mt-2 mb-2'>
                                            <p className='text-md text-gray-200'>Overview: {movie.overview}</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Star className='h-5 w-5 text-yellow-400' />
                                            <p className="text-md text-gray-300">Rating: {movie.vote_average.toFixed(1)}</p>
                                            <Star className='h-5 w-5 text-yellow-400'/>
                                            <p className='text-md text-gray-300'>Vote Count: {movie.vote_count}</p>
                                        </div>
                                       
                                        <div className='mt-4'>
                                        <Link to={`/movie/${movie.id}`} className="bg-yellow-300 text-black px-3 py-2 font-bold rounded-xl w-full text-center sm:w-auto block">
                            View Details
                        </Link>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MovieList;
