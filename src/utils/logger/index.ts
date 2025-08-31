export { logger } from './logger';
export type { LoggerConfig } from './logger';

// Easy global control functions
export const disableLogging = () => logger.disable();
export const enableLogging = () => logger.enable();