import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Calendar, Clapperboard, Users, Clock, Film, PlayCircle } from "lucide-react";
import Review from "../Components/Review";
import AverageRating from "../Components/AverageRating";
import Rating from "../Components/Rating";

const API_KEY = "68ca6900766065d0046fe2f6c2061a86";

function TvShowDetail() {
    const [tvshow, setTvshow] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        fetchTvShows();
        fetchCast();
    }, [id]);

    const fetchTvShows = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`);
            const data = await res.json();
            setTvshow(data);
        } catch (error) {
            console.log("Error fetching TV Show:", error);
        }
    };

    const fetchCast = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`);
            const data = await res.json();
            setCast(data.cast || []);
        } catch (error) {
            console.log("Error fetching cast:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center text-xl text-white">⏳ Loading...</div>;

    return (
        <div className="p-4 sm:p-6 w-full mx-auto bg-gray-950 text-white shadow-lg min-h-screen">
            {tvshow ? (
                <div>
                    {/* TV Show Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2">
                        <Clapperboard className="text-yellow-400" /> {tvshow.name}
                    </h1>

                    {/* Poster & Details */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                            alt={tvshow.name}
                            className="w-40 sm:w-64 rounded-lg shadow-md object-cover overflow-hidden"
                        />

                        <div className="flex flex-col gap-2 text-base sm:text-lg p-2">
                            <p className="mb-1 flex items-center gap-2">
                                <Film className="text-blue-400" /> <strong>Genres:</strong> {tvshow.genres.map((g) => g.name).join(", ")}
                            </p>
                            <p className="mb-1 flex items-center gap-2">
                                <Calendar className="text-green-400" /> <strong>First Air Date:</strong> {tvshow.first_air_date}
                            </p>
                            <p className="mb-1 flex items-center gap-2">
                                <Calendar className="text-red-400" /> <strong>Last Air Date:</strong> {tvshow.last_air_date || "Ongoing"}
                            </p>
                            <p className="mb-1 flex items-center gap-2">
                                <PlayCircle className="text-purple-400" /> <strong>Seasons:</strong> {tvshow.number_of_seasons} | <strong>Episodes:</strong> {tvshow.number_of_episodes}
                            </p>
                            <p className="mb-1 flex items-center gap-2">
                                <Star className="text-yellow-400" /> <strong>Rating:</strong> ⭐ {tvshow.vote_average.toFixed(1)} / 10
                            </p>
                            <p className="mb-1 flex items-center gap-2">
                                <Clock className="text-orange-400" /> <strong>Status:</strong> {tvshow.status}
                            </p>

                            {/* Ratings */}
                            <div className="mt-3">
                                <div className="flex gap-2">
                                    <p>Rate:</p>
                                    <Rating movieId={id} />
                                </div>
                                <AverageRating movieId={id} />
                            </div>
                        </div>
                    </div>

                    {/* Overview */}
                    <div className="mt-5 border rounded-lg px-4 py-6 bg-gray-900 text-sm sm:text-base">
                        <h1 className="font-bold">📖 Overview</h1>
                        <p>{tvshow.overview}</p>
                    </div>

                    {/* Cast Section */}
                    <h2 className="text-lg sm:text-xl font-semibold mt-6 flex items-center gap-2">
                        <Users className="text-pink-400" /> Cast:
                    </h2>
                    <div className="flex gap-2 sm:gap-4 overflow-x-auto py-2 scrollbar-hide">
                        {cast.slice(0, 9).map((actor) => (
                            <Link to={`/actor/${actor.id}`} className="cursor-pointer" key={actor.id}>
                                <div className="min-w-[70px] sm:min-w-[100px] text-center">
                                    <img
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/100"}
                                        alt={actor.name}
                                        className="w-16 sm:w-24 h-16 sm:h-24 rounded-full object-cover shadow-md"
                                    />
                                    <p className="text-xs sm:text-sm mt-1">{actor.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-3">
                        <Review />
                    </div>
                </div>
            ) : (
                <div className="text-center text-xl text-white">⚠️ TV Show not found.</div>
            )}
        </div>
    );
}

export default TvShowDetail;
