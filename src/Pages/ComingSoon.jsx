import React, { useEffect, useState } from "react";
import { LoaderCircle, CalendarDays } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ComingSoon() {
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = "68ca6900766065d0046fe2f6c2061a86";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    const fetchComingSoonMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setComingSoonMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComingSoonMovies();
  }, []);

  return (
    <div className="text-center p-6 bg-black min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-white">🎬 Coming Soon Movies</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoaderCircle className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
          {comingSoonMovies.length > 0 ? (
            comingSoonMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="w-full sm:w-72 bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <Link to={`/movie/${movie.id}`} className="block">
                  <motion.img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                    <p className="text-gray-600 mt-2 flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      <strong>Release Date:</strong> {movie.release_date}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No upcoming movies found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ComingSoon;
