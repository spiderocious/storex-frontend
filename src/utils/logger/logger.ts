interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

interface LoggerConfig {
  enabled: boolean;
  level: keyof LogLevel;
  externalService?: {
    endpoint: string;
    apiKey: string;
  };
}

class Logger {
  private config: LoggerConfig;
  private levels: LogLevel = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };

  constructor(config: LoggerConfig = { enabled: true, level: 'INFO' }) {
    this.config = config;
  }

  private shouldLog(level: keyof LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levels[level] <= this.levels[this.config.level];
  }

  private async sendToExternal(level: string, message: string, data?: any) {
    if (!this.config.externalService) return;
    
    try {
      await fetch(this.config.externalService.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.externalService.apiKey}`
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          source: 'file-service-app'
        })
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  log(message: string, data?: any) {
    if (!this.shouldLog('INFO')) return;
    console.log(`[INFO] ${message}`, data || '');
    this.sendToExternal('INFO', message, data);
  }

  error(message: string, error?: any) {
    if (!this.shouldLog('ERROR')) return;
    console.error(`[ERROR] ${message}`, error || '');
    this.sendToExternal('ERROR', message, error);
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('WARN')) return;
    console.warn(`[WARN] ${message}`, data || '');
    this.sendToExternal('WARN', message, data);
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('DEBUG')) return;
    console.debug(`[DEBUG] ${message}`, data || '');
    this.sendToExternal('DEBUG', message, data);
  }

  updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  disable() {
    this.config.enabled = false;
  }

  enable() {
    this.config.enabled = true;
  }
}

// Environment-based configuration
const loggerConfig: LoggerConfig = {
  enabled: import.meta.env.MODE !== 'production',
  level: (import.meta.env.VITE_LOG_LEVEL as keyof LogLevel) || 'INFO',
  externalService: import.meta.env.VITE_LOG_ENDPOINT ? {
    endpoint: import.meta.env.VITE_LOG_ENDPOINT,
    apiKey: import.meta.env.VITE_LOG_API_KEY
  } : undefined
};

export const logger = new Logger(loggerConfig);
export type { LoggerConfig };