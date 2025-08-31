import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBanner } from './error-banner';

describe('ErrorBanner Component', () => {
  const defaultProps = {
    message: 'Test error message'
  };

  it('renders with message', () => {
    render(<ErrorBanner {...defaultProps} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(<ErrorBanner {...defaultProps} title="Error Title" />);
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<ErrorBanner {...defaultProps} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorBanner {...defaultProps} showRetry onRetry={onRetry} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show dismiss button when dismissible is false', () => {
    render(<ErrorBanner {...defaultProps} dismissible={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders different types correctly', () => {
    const types = ['error', 'warning', 'info', 'success'] as const;
    
    types.forEach(type => {
      const { container } = render(
        <ErrorBanner {...defaultProps} type={type} />
      );
      expect(container.firstChild).toMatchSnapshot(`error-banner-${type}`);
    });
  });

  it('shows retry button only when showRetry is true', () => {
    render(<ErrorBanner {...defaultProps} showRetry={false} />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    
    render(<ErrorBanner {...defaultProps} showRetry onRetry={jest.fn()} />);
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});