import React, { useEffect, useState, useRef } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const apiKey = "68ca6900766065d0046fe2f6c2061a86";
                const [movieRes, actorRes, tvShowRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`),
                    fetch(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${searchQuery}`),
                    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${searchQuery}`)
                ]);

                const [movieData, actorData, tvShowData] = await Promise.all([
                    movieRes.json(), actorRes.json(), tvShowRes.json()
                ]);

                setSearchResults([
                    ...movieData.results.map(m => ({ id: m.id, title: m.title, type: "movie" })),
                    ...actorData.results.map(a => ({ id: a.id, name: a.name, type: "actor" })),
                    ...tvShowData.results.map(t => ({ id: t.id, title: t.name, type: "tvShow" }))
                ]);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleResultClick = (result) => {
        navigate(`/${result.type}/${result.id}`);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && selectedIndex !== -1) {
            handleResultClick(searchResults[selectedIndex]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full sm:w-72 md:w-96" ref={dropdownRef}>
            <form className="relative h-12 bg-zinc-900/90 rounded-xl p-2 flex items-center">
                <SearchIcon className="absolute left-4 text-white w-5 h-5" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, actors, TV shows..."
                    className="h-full pl-12 pr-4 bg-transparent text-white rounded-xl focus:outline-none focus:ring-yellow-500/50 w-full transition-all"
                    onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                    <X className="absolute right-4 text-white w-5 h-5 cursor-pointer" onClick={() => setSearchQuery("")} />
                )}
            </form>

            {searchQuery.trim() && (
                <div className="absolute top-full mt-2 w-full max-w-sm md:max-w-md lg:max-w-lg bg-black text-white shadow-lg rounded-lg max-h-[300px] overflow-y-auto z-50 animate-fade-in">
                    {loading ? (
                        <div className="p-3 text-gray-400 text-center">Loading...</div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                            <div
                                key={result.id}
                                className={`p-3 cursor-pointer transition-all ${
                                    selectedIndex === index ? "bg-gray-700" : "hover:bg-gray-800"
                                }`}
                                onClick={() => handleResultClick(result)}
                            >
                                {result.title || result.name} ({result.type})
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-400 text-center">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;
