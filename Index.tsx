
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import MovieCard from '@/components/MovieCard';
import { movies } from '@/data/movies';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (simplified - in real app would check JWT)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchTerm]);

  const topRatedMovies = movies
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 6);

  const recentMovies = movies
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation user={user} setUser={setUser} />
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-fade-in">
            MovieVault
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in">
            Discover, Rate & Review the Best Movies Ever Made
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8 animate-fade-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section className="px-6 py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Star className="w-6 h-6 text-yellow-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Top Rated Movies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Search Results or All Movies */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            {searchTerm ? `Search Results (${filteredMovies.length})` : 'All Movies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Movies Section */}
      <section className="px-6 py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Clock className="w-6 h-6 text-blue-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Latest Releases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {recentMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">MovieVault</h3>
          <p className="text-gray-400 mb-6">Your ultimate destination for movie reviews and ratings</p>
          <div className="flex justify-center space-x-6">
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {movies.length} Movies
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Community Driven
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Free Reviews
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
