import { logger } from '../utils/Logger';

/**
 * Global teardown function
 * Runs once after all tests
 */
async function globalTeardown() {
  // Check if global teardown should run
  if (process.env.RUN_GLOBAL_TEARDOWN === 'false') {
    console.log('Global teardown skipped (RUN_GLOBAL_TEARDOWN=false)');
    return;
  }

  logger.info('=== Global Teardown Started ===');
  
  // Add any global cleanup logic here
  // For example:
  // - Database cleanup
  // - Clearing test data
  // - Cleaning up temporary files
  console.log('Performing global teardown tasks...');
  
  logger.info('=== Global Teardown Completed ===');
}

export default globalTeardown;
