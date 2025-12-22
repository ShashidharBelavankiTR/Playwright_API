import { logger } from '../utils/Logger';

/**
 * Global teardown function
 * Runs once after all tests
 */
async function globalTeardown() {
  logger.info('=== Global Teardown Started ===');
  
  // Add any global cleanup logic here
  // For example:
  // - Database cleanup
  // - Clearing test data
  // - Cleaning up temporary files
  
  logger.info('=== Global Teardown Completed ===');
}

export default globalTeardown;
