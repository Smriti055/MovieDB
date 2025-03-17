import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Rating from "../Components/Rating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AverageRating from "../Components/AverageRating";
import Review from "../Components/Review";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [videos, setVideos] = useState([]); // Store multiple videos
    const [cast, setCast] = useState([]);
    const [images, setImages] = useState([]);
    
    const { id } = useParams();
    const API_KEY = "68ca6900766065d0046fe2f6c2061a86";

    useEffect(() => {
        fetchMovieDetails();
        fetchCast();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
            const movieData = await movieRes.json();
            setMovie(movieData);

            const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
            const videoData = await videoRes.json();
            
            // Filter for trailers, teasers, and clips
            const filteredVideos = videoData.results.filter(video => 
                ["Trailer", "Teaser", "Clip"].includes(video.type) && video.site === "YouTube"
            );

            setVideos(filteredVideos.slice(0, 1)); // Store only the first video

            const imageRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`);
            const imageData = await imageRes.json();
            setImages(imageData.backdrops || []);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const fetchCast = async () => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
            const data = await res.json();
            setCast(data.cast.slice(0, 6)); // Show only top 6 actors
        } catch (error) {
            console.error("Error fetching cast:", error);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div className="w-full min-h-screen text-white bg-gray-900">
            {movie && (
                <>
                    {/* Backdrop Carousel */}
                    {images.length > 0 && (
                        <Slider {...sliderSettings} className="w-full h-96">
                            {images.map((img, index) => (
                                <div key={index} className="h-96">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        src={`https://image.tmdb.org/t/p/original${img.file_path}`} 
                                        alt="Movie Scene" 
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
    
                    <div className="container mx-auto p-5 flex flex-col md:flex-row gap-8">
                        {/* Movie Poster */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <img 
                                className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md" 
                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} 
                                alt={movie.original_title} 
                            />
                        </div>
    
                        {/* Movie Details */}
                        <div className="w-full md:w-2/3">
                            <h1 className="text-4xl font-bold mb-2">{movie.original_title}</h1>
                            <p className="text-xl text-gray-400 italic mb-4">{movie.tagline}</p>
                            <p className="text-lg mb-4">{movie.overview}</p>
                            
                            <p><strong>Rating:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
                            <p><strong>Status:</strong> {movie.status}</p>
                            <p><strong>Runtime:</strong> {movie.runtime} mins</p>
                            <p><strong>Release Date:</strong> {movie.release_date}</p>
    
                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {movie.genres?.map((genre) => (
                                    <span key={genre.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
    
                            {/* Ratings */}
                            <div className="mt-4">
                                <div className="flex gap-2">
                                    <p>Rate:</p>
                                    <Rating movieId={id} />
                                </div>
                                <AverageRating movieId={id} />
                            </div>
                        </div>
                    </div>
    
                    {/* Trailer Section */}
                    {videos.length > 0 && (
                        <div className="container mx-auto py-10 flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                            <div className="w-full max-w-3xl aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${videos[0].key}`}
                                    title={videos[0].name}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
    
                    {/* Cast Section */}
                    <div className="container mx-auto py-10">
                        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {cast.map(actor => (
                                <Link to={`/actor/${actor.id}`} className="cursor-pointer" key={actor.id}>
                                    <div className="text-center">
                                        <img
                                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto"
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "https://via.placeholder.com/200"}
                                            alt={actor.name}
                                        />
                                        <p className="mt-2 text-sm font-semibold">{actor.name}</p>
                                        <p className="text-xs text-gray-400">as {actor.character}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
    
                    {/* Reviews Section */}
                    <div className="container mx-auto py-10">
                        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                        <Review/>
                    </div>
                </>
            )}
        </div>
    );
    
};

export default MovieDetails;