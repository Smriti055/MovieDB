import React from 'react';
import Navbar from './Components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import MovieList from './Components/MovieList';
import MovieDetails from './Pages/MovieDetails';
import TopRated from './Pages/TopRated';
import ActorDetails from './Pages/ActorDetails';
import ComingSoon from './Pages/ComingSoon';
import TvShows from './Pages/TvShows';
import TvShowDetail from './Pages/TvShowDetail';
import Footer from './Components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes> {/* Wrap Route inside Routes */}
        <Route path="/" element={<Home />} /> {/* Fix: Use <Home /> inside element */}
        <Route path="/movies" element={<MovieList />} />
        <Route path="movie/:id" element={<MovieDetails/>} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/actor/:person_id" element={<ActorDetails />} />
        <Route path = "/tvshows" element={<TvShows/>} />
        <Route path = "/tvshow/:id" element={<TvShowDetail/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
