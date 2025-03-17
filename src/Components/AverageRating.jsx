import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function AverageRating({ movieId }) {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const updateAverageRating = () => {
            const ratings = JSON.parse(localStorage.getItem(`movie-ratings-${movieId}`)) || {};

            const ratingValues = Object.values(ratings); // Extract all ratings
            if (ratingValues.length > 0) {
                const total = ratingValues.reduce((sum, rating) => sum + rating, 0);
                setAverageRating(total / ratingValues.length);
            } else {
                setAverageRating(0);
            }
        };

        updateAverageRating();
        window.addEventListener('storage', updateAverageRating);

        return () => {
            window.removeEventListener('storage', updateAverageRating);
        };
    }, [movieId]);

    return (
        <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold ml-2">
                Average Rating: {averageRating.toFixed(1)}
            </span>
        </div>
    );
}

export default AverageRating;
