import React, { useEffect, useState } from "react";
import { formatTimestamp } from "../lib/utils";
import { useParams } from "react-router-dom";

function Review() {
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState([]);
    const [userId, setUserId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editId, setEditId] = useState(null);
    const [sortOption, setSortOption] = useState("mostRecent");
    const [expanded, setExpanded] = useState({});
    const previewLength = 100;

    const { id } = useParams();
    const API_KEY = "68ca6900766065d0046fe2f6c2061a86";

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`
                );
                const data = await res.json();

                const apiReviews = data.results.map((review) => ({
                    id: review.id,
                    content: review.content,
                    upvotes: 0,
                    downvotes: 0,
                    timestamp: review.created_at,
                    userId: "apiUser"
                }));

                const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
                const storedVotes = JSON.parse(localStorage.getItem(`votes_${id}`)) || {};

                const combinedReviews = [...apiReviews, ...storedReviews].map((review) => ({
                    ...review,
                    upvotes: storedVotes[review.id] === "up" ? review.upvotes + 1 : review.upvotes,
                    downvotes: storedVotes[review.id] === "down" ? review.downvotes + 1 : review.downvotes
                }));

                setReviews(combinedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();

        let storedUserId = JSON.parse(localStorage.getItem("userId"));
        if (!storedUserId) {
            storedUserId = Date.now().toString();
            localStorage.setItem("userId", JSON.stringify(storedUserId));
        }
        setUserId(storedUserId);
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (review.trim() === "") return;
        if (review.trim().length > 250) {
            alert("Review must be within 250 characters");
            return;
        }

        const newReview = {
            id: Date.now(),
            content: review,
            upvotes: 0,
            downvotes: 0,
            timestamp: new Date().toISOString(),
            userId: userId
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
        setReview("");
    };

    const handleVote = (reviewId, type) => {
        const storedVotes = JSON.parse(localStorage.getItem(`votes_${id}`)) || {};

        if (storedVotes[reviewId] === type) {
            return; // Prevent duplicate voting
        }

        const updatedReviews = reviews.map((r) => {
            if (r.id === reviewId) {
                if (type === "up") {
                    return { ...r, upvotes: r.upvotes + 1, downvotes: storedVotes[reviewId] === "down" ? r.downvotes - 1 : r.downvotes };
                } else {
                    return { ...r, downvotes: r.downvotes + 1, upvotes: storedVotes[reviewId] === "up" ? r.upvotes - 1 : r.upvotes };
                }
            }
            return r;
        });

        setReviews(updatedReviews);
        storedVotes[reviewId] = type;
        localStorage.setItem(`votes_${id}`, JSON.stringify(storedVotes));
    };

    const handleEdit = (reviewId, content, reviewUserId) => {
        if (reviewUserId !== userId) {
            alert("You can only edit your review");
            return;
        }
        setEditId(reviewId);
        setEditText(content);
    };

    const handleSaveText = () => {
        const updatedReviews = reviews.map((r) =>
            r.id === editId ? { ...r, content: editText } : r
        );
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
        setEditText("");
        setEditId(null);
    };

    const deleteReview = (reviewId, reviewUserId) => {
        if (reviewUserId !== userId) {
            alert("You can only delete your own reviews");
            return;
        }
        const updatedReviews = reviews.filter((r) => r.id !== reviewId);
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortOption === "mostHelpful") return b.upvotes - a.upvotes;
        if (sortOption === "mostRecent") return new Date(b.timestamp) - new Date(a.timestamp);
        return 0;
    });

    return (
        <div className="w-full p-6 bg-gray-900 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                />
                <button className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Submit
                </button>
            </form>
            <div className="mb-4 flex items-center justify-between text-white">
                <label className="font-semibold">Sort By:</label>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border p-2 rounded-md text-black"
                >
                    <option value="mostRecent">Most Recent</option>
                    <option value="mostHelpful">Most Helpful</option>
                </select>
            </div>

            {sortedReviews.length > 0 ? (
                sortedReviews.map((r) => (
                    <div key={r.id} className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
                        <div className="flex justify-between items-center">
                            <small className="text-gray-400">🕒 {formatTimestamp(r.timestamp)}</small>
                            {r.userId === userId && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(r.id, r.content, r.userId)}
                                        className="text-yellow-400 hover:text-yellow-300"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => deleteReview(r.id, r.userId)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {editId === r.id ? (
                            <div>
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2 border rounded-md text-black"
                                />
                                <button
                                    onClick={handleSaveText}
                                    className="mt-2 bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-100">
                                {expanded[r.id] ? r.content : `${r.content.slice(0, previewLength)}`}
                                {r.content.length > previewLength && (
                                    <button
                                        className="text-blue-400 hover:underline ml-2"
                                        onClick={() =>
                                            setExpanded((prev) => ({ ...prev, [r.id]: !prev[r.id] }))
                                        }
                                    >
                                        {expanded[r.id] ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </p>
                        )}

                        {/* Like & Dislike Buttons */}
                        <div className="flex items-center space-x-4 mt-2">
                            <button onClick={() => handleVote(r.id, "up")} className="text-green-400 hover:text-green-300">
                                👍 {r.upvotes}
                            </button>
                            <button onClick={() => handleVote(r.id, "down")} className="text-red-400 hover:text-red-300">
                                👎 {r.downvotes}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No reviews yet. Be the first to write one!</p>
            )}
        </div>
    );
}

export default Review;
