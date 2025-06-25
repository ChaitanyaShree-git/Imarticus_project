import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(2);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('/movies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(response.data.movies);
        setFilteredMovies(response.data.movies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const applyFilters = () => {
    let result = [...movies];

    if (searchTerm) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter) {
      result = result.filter(movie => movie.rating === parseInt(ratingFilter));
    }

    setFilteredMovies(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedMovies(filteredMovies.slice(startIndex, endIndex));
  }, [filteredMovies, currentPage]);

  const sortTopRated = () => {
    const sorted = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
    setFilteredMovies(sorted);
  };

  const sortLowestRated = () => {
    const sorted = [...movies].sort((a, b) => a.rating - b.rating).slice(0, 10);
    setFilteredMovies(sorted);
  };

  const sortMostRecent = () => {
    const sorted = [...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 10);
    setFilteredMovies(sorted);
  };

  const sortOldest = () => {
    const sorted = [...movies].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
    setFilteredMovies(sorted);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  }

  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  return (
    <div className="dashboard-container">
      <div id="header" className='header'>
        <button onClick={handleLogout} className='logoutButton'>Logout</button>
      </div>
      <h1> Movie Dashboard</h1>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <button onClick={applyFilters}>Search / Filter</button>
      </div>

      <div className="search-filter-container">
        <button onClick={sortTopRated}>Top 10 Highest Rated</button>
        <button onClick={sortLowestRated}>Bottom 10 Lowest Rated</button>
        <button onClick={sortMostRecent}>10 Most Recent</button>
        <button onClick={sortOldest}>Oldest to Most Recent</button>
      </div>

      <div className="movie-grid">
        {displayedMovies.length > 0 ? (
          displayedMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <h3 className="movie-title-link"  onClick={() => navigate(`/movies/${movie.title}/reviews`)}>{movie.title}</h3>
              <p> Rating: {movie.rating} / 5</p>
              <p> Released: {movie.releaseDate}</p>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ⬅ Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
