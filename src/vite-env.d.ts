/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LOG_LEVEL: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  readonly VITE_LOG_ENDPOINT?: string;
  readonly VITE_LOG_API_KEY?: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_MAX_FILE_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}