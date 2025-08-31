import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './navbar';
import { useAuth } from '@/providers/auth-provider';

// Mock the auth hook
jest.mock('@/providers/auth-provider');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  const mockAuthData = {
    user: { id: '1', email: 'test@example.com', createdAt: '2024-01-01T00:00:00Z' },
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    refreshUser: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(mockAuthData);
  });

  it('renders navigation links when authenticated', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('File Service')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Buckets')).toBeInTheDocument();
    expect(screen.getByText('Create Bucket')).toBeInTheDocument();
  });

  it('displays user email', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const logout = jest.fn();
    mockUseAuth.mockReturnValue({ ...mockAuthData, logout });
    
    renderWithRouter(<Navbar />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('toggles mobile menu', () => {
    renderWithRouter(<Navbar />);
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
    
    // Click mobile menu button
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });

  it('closes mobile menu when nav link is clicked', () => {
    renderWithRouter(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);
    
    // Click a nav link
    const dashboardLink = screen.getAllByText('Dashboard')[0]; // Get first occurrence
    fireEvent.click(dashboardLink);
    
    // Menu should close (no close button visible)
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
  });

  it('does not render when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ ...mockAuthData, isAuthenticated: false });
    
    const { container } = renderWithRouter(<Navbar />);
    expect(container.firstChild).toBeNull();
  });

  it('highlights active page', () => {
    // Mock location to be on dashboard
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/dashboard' }),
      useNavigate: () => mockNavigate
    }));

    renderWithRouter(<Navbar />);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('bg-accent', 'text-focus');
  });
});