import { Book, Calendar, PenIcon, PersonStandingIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ActorDetails() {
  const { person_id } = useParams();
  const API_KEY = "68ca6900766065d0046fe2f6c2061a86";
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const actorRes = await fetch(`https://api.themoviedb.org/3/person/${person_id}?api_key=${API_KEY}&language=en-US`);
        const actorData = await actorRes.json();
        setActor(actorData);

        // Fetch movie and TV credits
        const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${person_id}/combined_credits?api_key=${API_KEY}&language=en-US`);
        const creditsData = await creditsRes.json();
        setMovies(creditsData.cast.slice(0, 10)); // Limit to 10 items

        // Fetch additional images
        const imagesRes = await fetch(`https://api.themoviedb.org/3/person/${person_id}/images?api_key=${API_KEY}`);
        const imagesData = await imagesRes.json();
        setImages(imagesData.profiles);
      } catch (error) {
        console.log("Error fetching actor details:", error);
      }
    };

    fetchActorDetails();
  }, [person_id]);

  return (
    <div className="w-full text-white bg-gray-900">
      {/* Section 1: Photo & Basic Details */}
      {actor && (
        <div className="relative w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center bg-black px-4 sm:px-8">
          {/* Background Image */}
          {images.length > 0 && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${images[0].file_path})` }}
            ></div>
          )}

          <div className="relative flex flex-col md:flex-row items-center text-center md:text-left">
            {/* Actor Image */}
            <img
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : "https://via.placeholder.com/300"}
              alt={actor.name}
              className="rounded-lg shadow-lg w-48 h-64 object-cover md:w-60 md:h-80"
            />

            {/* Actor Details */}
            <div className="md:ml-8 mt-6 md:mt-0 text-sm sm:text-lg">
              <h1 className="text-3xl sm:text-4xl font-bold">{actor.name}</h1>
              <div className="flex items-center gap-2 mt-3">
                <PersonStandingIcon className="w-6 h-6 text-yellow-600" />
                <p>Known For: {actor.known_for_department}</p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-6 h-6 text-yellow-600" />
                <p>Born: {actor.birthday} {actor.place_of_birth && `(${actor.place_of_birth})`}</p>
              </div>

              {actor.also_known_as?.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Also Known As:</p>
                  <ul>
                    {actor.also_known_as.map((known, index) => (
                      <li key={index} className="list-none">{known}</li>
                    ))}
                  </ul>
                </div>
              )}

              {actor.deathday && <p className="text-lg mt-2 text-red-500">Died: {actor.deathday}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Biography */}
      <div className="bg-gray-800 py-10 px-4 sm:px-12">
        <div className="flex items-center gap-1">
          <h2 className="text-2xl sm:text-3xl font-semibold">Biography</h2>
          <PenIcon className="w-6 h-6" />
        </div>

        <p className="text-md sm:text-lg mt-3 max-w-[90%] mx-auto">{actor?.biography || "Biography not available."}</p>
      </div>

      {/* Section 3: Movies & TV Shows */}
      <div className="bg-gray-900 py-10 px-4 sm:px-12">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Movies & TV Shows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="block">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "https://via.placeholder.com/200"}
                alt={movie.title || movie.name}
                className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition"
              />
              <p className="text-center mt-2 text-sm">{movie.title || movie.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActorDetails;
