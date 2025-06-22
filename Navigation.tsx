
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Star, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthModal from './AuthModal';

interface NavigationProps {
  user: any;
  setUser: (user: any) => void;
}

const Navigation = ({ user, setUser }: NavigationProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              MovieVault
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Top Rated
              </Link>
              <Link to="/recent" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Link>
              <Link to="/movies" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <Star className="w-4 h-4 mr-1" />
                All Movies
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <User className="w-4 h-4 mr-2" />
                      {user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-700">
                      My Reviews
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-white hover:bg-slate-700"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openAuthModal('signin')}
                    className="text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => openAuthModal('signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        setUser={setUser}
      />
    </>
  );
};

export default Navigation;
