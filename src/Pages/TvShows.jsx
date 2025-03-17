import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_KEY = "68ca6900766065d0046fe2f6c2061a86";

function TvShows() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentTvShows();
  }, []);

  const fetchRecentTvShows = async () => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await res.json();
      setTvShows(data.results);
    } catch (err) {
      setError("Failed to load TV shows");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Recent TV Shows 📺</h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
        {tvShows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 50 }} // Slide up effect
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/tvshow/${show.id}`} className="block">
              <div className="border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{show.name}</h2>
                  <p className="text-sm text-gray-400">⭐ {show.vote_average} / 10</p>
                  <p className="text-sm mt-2 text-gray-300">
                    {show.overview.length > 100 ? show.overview.substring(0, 100) + "..." : show.overview}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TvShows;
