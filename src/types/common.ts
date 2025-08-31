export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string | number;
  retryable?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}