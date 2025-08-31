import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './select';

describe('Select Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    options: defaultOptions
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no value selected', () => {
    render(<Select {...defaultProps} placeholder="Choose option" />);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders selected option label', () => {
    render(<Select {...defaultProps} value="option1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<Select {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    const onChange = jest.fn();
    render(<Select {...defaultProps} onChange={onChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const option = screen.getByText('Option 2');
    fireEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith('option2');
  });

  it('closes dropdown when option is selected', () => {
    render(<Select {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    // Options should no longer be visible
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(<Select {...defaultProps} label="Category" />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Select {...defaultProps} label="Category" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Select {...defaultProps} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(<Select {...defaultProps} helperText="Choose your preferred option" />);
    expect(screen.getByText('Choose your preferred option')).toBeInTheDocument();
  });

  it('disables select when disabled prop is true', () => {
    render(<Select {...defaultProps} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('tabIndex', '-1');
  });

  it('handles keyboard navigation', () => {
    render(<Select {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    
    // Enter key should open dropdown
    fireEvent.keyDown(select, { key: 'Enter' });
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    // Escape key should close dropdown
    fireEvent.keyDown(select, { key: 'Escape' });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('shows check icon for selected option', () => {
    render(<Select {...defaultProps} value="option2" />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    const selectedOption = screen.getByText('Option 2').parentElement;
    expect(selectedOption?.querySelector('svg')).toBeInTheDocument();
  });
});