
import { useState, useEffect } from 'react';
import { Star, X, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface MovieModalProps {
  movie: any;
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const MovieModal = ({ movie, isOpen, onClose, user }: MovieModalProps) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (isOpen) {
      
      const storedReviews = localStorage.getItem(`reviews_${movie.id}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }

    
      if (user) {
        const storedRating = localStorage.getItem(`rating_${user.id}_${movie.id}`);
        if (storedRating) {
          const rating = JSON.parse(storedRating);
          setUserRating(rating.stars);
          setReviewText(rating.review || '');
        }
      }
    }
  }, [isOpen, movie.id, user]);

  const handleRatingSubmit = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate and review movies.",
        variant: "destructive",
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    const newRating = {
      id: Date.now(),
      userId: user.id,
      username: user.username,
      stars: userRating,
      review: reviewText,
      createdAt: new Date().toISOString(),
    };

   
    localStorage.setItem(`rating_${user.id}_${movie.id}`, JSON.stringify(newRating));

   
    const updatedReviews = reviews.filter((r: any) => r.userId !== user.id);
    updatedReviews.unshift(newRating);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${movie.id}`, JSON.stringify(updatedReviews));

    toast({
      title: "Review submitted!",
      description: "Thank you for your review.",
    });
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < (interactive ? (hoverRating || userRating) : rating)
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-400 hover:text-yellow-300'
        }`}
        onClick={interactive ? () => setUserRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {movie.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movie Poster and Info */}
          <div>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">
                  Released: {new Date(movie.releaseDate).getFullYear()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Genre: {movie.genre}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {renderStars(movie.averageRating)}
                <span className="text-lg font-semibold text-yellow-400">
                  {movie.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({movie.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="space-y-6">
            {/* User Rating Section */}
            {user && (
              <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Rate this movie</h3>
                
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(userRating, true)}
                  <span className="text-sm text-gray-400 ml-2">
                    {userRating > 0 ? `${userRating}/5 stars` : 'Click to rate'}
                  </span>
                </div>
                
                <Textarea
                  placeholder="Write your review (optional)..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mb-4"
                  rows={4}
                />
                
                <Button 
                  onClick={handleRatingSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Submit Review
                </Button>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Reviews ({reviews.length})
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="bg-slate-800 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-400">
                            {review.username}
                          </span>
                          <div className="flex items-center">
                            {renderStars(review.stars)}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review && (
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {review.review}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review this movie!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieModal;
