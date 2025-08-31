import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByText('Loading');
    expect(button).toBeDisabled();
    // Check for loading spinner (div with animate-spin class)
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders different variants correctly', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
    
    variants.forEach(variant => {
      const { container } = render(
        <Button variant={variant}>{variant} button</Button>
      );
      expect(container.firstChild).toMatchSnapshot(`button-${variant}`);
    });
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach(size => {
      const { container } = render(
        <Button size={size}>{size} button</Button>
      );
      expect(container.firstChild).toMatchSnapshot(`button-${size}`);
    });
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">🚀</span>;
    render(<Button icon={icon}>With Icon</Button>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });
});