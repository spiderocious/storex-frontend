import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox Component', () => {
  const defaultProps = {
    checked: false,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders unchecked state', () => {
    render(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('renders checked state', () => {
    render(<Checkbox {...defaultProps} checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange when label is clicked', () => {
    const onChange = jest.fn();
    render(<Checkbox {...defaultProps} label="Accept terms" onChange={onChange} />);
    
    const label = screen.getByText('Accept terms');
    fireEvent.click(label);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('handles keyboard interaction', () => {
    const onChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(true);
    
    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders with label when provided', () => {
    render(<Checkbox {...defaultProps} label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Checkbox {...defaultProps} label="Accept terms" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Checkbox {...defaultProps} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(<Checkbox {...defaultProps} helperText="Check this box to continue" />);
    expect(screen.getByText('Check this box to continue')).toBeInTheDocument();
  });

  it('disables checkbox when disabled prop is true', () => {
    render(<Checkbox {...defaultProps} disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not call onChange when disabled and clicked', () => {
    const onChange = jest.fn();
    render(<Checkbox {...defaultProps} disabled onChange={onChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders indeterminate state', () => {
    render(<Checkbox {...defaultProps} indeterminate />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('hides helper text when error is present', () => {
    render(<Checkbox {...defaultProps} helperText="Helper text" error="Error message" />);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});