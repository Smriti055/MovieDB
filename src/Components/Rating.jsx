import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function Rating({ movieId, userId }) { // userId ensures each user sees only their rating
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const storedRating = JSON.parse(localStorage.getItem(`rating-${movieId}-${userId}`)) || 0;
        setRating(storedRating);
    }, [movieId, userId]);

    const handleRating = (newRating) => {
        // Store individual user rating
        localStorage.setItem(`rating-${movieId}-${userId}`, JSON.stringify(newRating));
        setRating(newRating);

        // Update global rating storage
        let ratings = JSON.parse(localStorage.getItem(`movie-ratings-${movieId}`)) || {};
        ratings[userId] = newRating; // Assign rating per user

        localStorage.setItem(`movie-ratings-${movieId}`, JSON.stringify(ratings));

        // Notify other components of the change
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                    <Star
                        key={starValue}
                        className={`h-6 w-6 cursor-pointer transition-transform ${
                            starValue <= (hoverRating || rating) ? "text-yellow-300 scale-110" : "text-gray-300"
                        }`}
                        onClick={() => handleRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${starValue} out of 5`}
                        fill={starValue <= (hoverRating || rating) ? "#FBBF24" : "#D1D5DB"}
                    />
                );
            })}
        </div>
    );
}

export default Rating;
