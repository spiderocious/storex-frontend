import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineBars3, HiOutlineXMark, HiOutlineUser } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/configs';

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.BUCKETS, label: 'Buckets' }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={`bg-primary border-b border-hover ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to={ROUTES.DASHBOARD} 
            className="text-xl font-bold text-secondary hover:text-accent transition-colors"
          >
            File Service
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActivePage(link.path) 
                    ? 'bg-accent text-focus' 
                    : 'text-text-secondary hover:text-secondary hover:bg-hover'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to={ROUTES.BUCKET_CREATE}
              className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-secondary hover:bg-hover transition-colors"
            >
              Create Bucket
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <HiOutlineUser className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            
            <Button
              variant="ghost"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              icon={isMobileMenuOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-hover">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    block px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActivePage(link.path) 
                      ? 'bg-accent text-focus' 
                      : 'text-text-secondary hover:text-secondary hover:bg-hover'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <Link
                to={ROUTES.BUCKET_CREATE}
                className="block px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-secondary hover:bg-hover transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Bucket
              </Link>
              
              <div className="pt-4 border-t border-hover">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary">
                  <HiOutlineUser className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleLogout}
                  className="w-full justify-start"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};