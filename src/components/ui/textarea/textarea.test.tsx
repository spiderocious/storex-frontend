import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with value', () => {
    render(<Textarea {...defaultProps} value="Test content" />);
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const onChange = jest.fn();
    render(<Textarea {...defaultProps} onChange={onChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(onChange).toHaveBeenCalledWith('New text');
  });

  it('renders with label when provided', () => {
    render(<Textarea {...defaultProps} label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Textarea {...defaultProps} label="Description" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Textarea {...defaultProps} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when provided and no error', () => {
    render(<Textarea {...defaultProps} helperText="Enter a description" />);
    expect(screen.getByText('Enter a description')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Textarea {...defaultProps} helperText="Helper text" error="Error message" />);
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('disables textarea when disabled prop is true', () => {
    render(<Textarea {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows character count when maxLength is provided', () => {
    render(<Textarea {...defaultProps} value="Hello" maxLength={100} />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('sets custom rows when provided', () => {
    render(<Textarea {...defaultProps} rows={6} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '6');
  });
});