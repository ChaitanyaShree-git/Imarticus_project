
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MovieModal from './MovieModal';

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string;
  averageRating: number;
  reviewCount: number;
  genre: string;
}

interface MovieCardProps {
  movie: Movie;
  user: any;
}

const MovieCard = ({ movie, user }: MovieCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 cursor-pointer group">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Details
              </Button>
            </div>
            <Badge className="absolute top-2 right-2 bg-yellow-500/90 text-black font-semibold">
              {movie.averageRating.toFixed(1)}
            </Badge>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
              <Badge variant="outline" className="border-slate-600 text-gray-300 text-xs">
                {movie.genre}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {renderStars(movie.averageRating)}
              </div>
              <span className="text-gray-400 text-sm">
                {movie.reviewCount} reviews
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <MovieModal 
        movie={movie}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={user}
      />
    </>
  );
};

export default MovieCard;
