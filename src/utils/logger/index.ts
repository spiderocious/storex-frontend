export { logger } from './logger';
export type { LoggerConfig } from './logger';

// Easy global control functions - import logger locally
import { logger as loggerInstance } from './logger';
export const disableLogging = () => loggerInstance.disable();
export const enableLogging = () => loggerInstance.enable();