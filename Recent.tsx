
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import MovieCard from '@/components/MovieCard';
import { movies } from '@/data/movies';

const Recent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const recentMovies = movies
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation user={user} setUser={setUser} />
      
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Clock className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Latest Releases</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} user={user} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recent;
