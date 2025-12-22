import { config } from '../config/ConfigManager';
import { logger } from '../utils/Logger';

/**
 * Global setup function
 * Runs once before all tests
 */
async function globalSetup() {
  // Check if global setup should run
  if (process.env.RUN_GLOBAL_SETUP === 'false') {
    console.log('Global setup skipped (RUN_GLOBAL_SETUP=false)');
    return;
  }

  logger.info('=== Global Setup Started ===');
  logger.info(`Environment: ${config.getEnvironment()}`);
  logger.info(`Base URL: ${config.getBaseUrl()}`);
  logger.info(`API Base URL: ${config.getApiBaseUrl()}`);
  
  // Add any global setup logic here
  // For example:
  // - Database seeding
  // - Authentication state persistence
  // - Test data preparation
  console.log('Performing global setup tasks...');
  
  logger.info('=== Global Setup Completed ===');
}

export default globalSetup;
