import * as dotenv from 'dotenv';
import { config } from './src/config/ConfigManager';

// Load environment variables
dotenv.config();

/**
 * Verify all environment variables are correctly loaded and mapped
 */
function verifyEnvironmentVariables() {
  console.log('\n=== Environment Variables Verification ===\n');

  const checks = [
    // Environment Configuration
    {
      name: 'ENVIRONMENT',
      envValue: process.env.ENVIRONMENT,
      mappedValue: config.get('environment'),
      expectedType: 'string',
      description: 'Environment name (dev/staging/prod)'
    },

    // Base URLs
    {
      name: 'BASE_URL',
      envValue: process.env.BASE_URL,
      mappedValue: config.getBaseUrl(),
      expectedType: 'string',
      description: 'Base URL for UI testing'
    },
    {
      name: 'API_BASE_URL',
      envValue: process.env.API_BASE_URL,
      mappedValue: config.getApiBaseUrl(),
      expectedType: 'string',
      description: 'Base URL for API testing'
    },

    // Timeout Settings
    {
      name: 'DEFAULT_TIMEOUT',
      envValue: process.env.DEFAULT_TIMEOUT,
      mappedValue: config.get('defaultTimeout'),
      expectedType: 'number',
      description: 'Default timeout in milliseconds'
    },
    {
      name: 'NAVIGATION_TIMEOUT',
      envValue: process.env.NAVIGATION_TIMEOUT,
      mappedValue: config.get('navigationTimeout'),
      expectedType: 'number',
      description: 'Navigation timeout in milliseconds'
    },
    {
      name: 'ACTION_TIMEOUT',
      envValue: process.env.ACTION_TIMEOUT,
      mappedValue: config.get('actionTimeout'),
      expectedType: 'number',
      description: 'Action timeout in milliseconds'
    },

    // Browser Settings
    {
      name: 'HEADLESS',
      envValue: process.env.HEADLESS,
      mappedValue: config.isHeadless(),
      expectedType: 'boolean',
      description: 'Run browser in headless mode'
    },
    {
      name: 'BROWSER',
      envValue: process.env.BROWSER,
      mappedValue: config.getBrowser(),
      expectedType: 'string',
      description: 'Browser type (chromium/firefox/webkit)'
    },
    {
      name: 'VIEWPORT_WIDTH',
      envValue: process.env.VIEWPORT_WIDTH,
      mappedValue: config.getViewport().width,
      expectedType: 'number',
      description: 'Viewport width in pixels'
    },
    {
      name: 'VIEWPORT_HEIGHT',
      envValue: process.env.VIEWPORT_HEIGHT,
      mappedValue: config.getViewport().height,
      expectedType: 'number',
      description: 'Viewport height in pixels'
    },

    // Test Settings
    {
      name: 'PARALLEL_WORKERS',
      envValue: process.env.PARALLEL_WORKERS,
      mappedValue: config.get('parallelWorkers'),
      expectedType: 'number',
      description: 'Number of parallel workers'
    },
    {
      name: 'RETRIES',
      envValue: process.env.RETRIES,
      mappedValue: config.get('retries'),
      expectedType: 'number',
      description: 'Number of test retries'
    },
    {
      name: 'SLOW_MO',
      envValue: process.env.SLOW_MO,
      mappedValue: config.get('slowMo'),
      expectedType: 'number',
      description: 'Slow down actions by milliseconds'
    },

    // Global Setup/Teardown
    {
      name: 'RUN_GLOBAL_SETUP',
      envValue: process.env.RUN_GLOBAL_SETUP,
      mappedValue: process.env.RUN_GLOBAL_SETUP !== 'false',
      expectedType: 'boolean',
      description: 'Run global setup before tests'
    },
    {
      name: 'RUN_GLOBAL_TEARDOWN',
      envValue: process.env.RUN_GLOBAL_TEARDOWN,
      mappedValue: process.env.RUN_GLOBAL_TEARDOWN !== 'false',
      expectedType: 'boolean',
      description: 'Run global teardown after tests'
    },

    // Logging
    {
      name: 'LOG_LEVEL',
      envValue: process.env.LOG_LEVEL,
      mappedValue: config.get('logLevel'),
      expectedType: 'string',
      description: 'Log level (error/warn/info/debug)'
    },
    {
      name: 'LOG_TO_FILE',
      envValue: process.env.LOG_TO_FILE,
      mappedValue: config.get('logToFile'),
      expectedType: 'boolean',
      description: 'Enable file logging'
    },

    // Screenshots
    {
      name: 'SCREENSHOT_ON_FAILURE',
      envValue: process.env.SCREENSHOT_ON_FAILURE,
      mappedValue: config.get('screenshotOnFailure'),
      expectedType: 'boolean',
      description: 'Take screenshot on test failure'
    },
    {
      name: 'SCREENSHOT_ON_SUCCESS',
      envValue: process.env.SCREENSHOT_ON_SUCCESS,
      mappedValue: config.get('screenshotOnSuccess'),
      expectedType: 'boolean',
      description: 'Take screenshot on test success'
    },

    // Video Recording
    {
      name: 'VIDEO_ON_FAILURE',
      envValue: process.env.VIDEO_ON_FAILURE,
      mappedValue: config.get('videoOnFailure'),
      expectedType: 'string',
      description: 'Video recording mode'
    },

    // API Settings
    {
      name: 'API_TIMEOUT',
      envValue: process.env.API_TIMEOUT,
      mappedValue: config.get('apiTimeout'),
      expectedType: 'number',
      description: 'API request timeout in milliseconds'
    },
    {
      name: 'API_MAX_RETRIES',
      envValue: process.env.API_MAX_RETRIES,
      mappedValue: config.get('apiMaxRetries'),
      expectedType: 'number',
      description: 'Maximum API request retries'
    },
  ];

  let passCount = 0;
  let failCount = 0;

  checks.forEach((check) => {
    const actualType = typeof check.mappedValue;
    const typeMatches = actualType === check.expectedType;
    
    let valueMatches = false;
    if (check.expectedType === 'number') {
      valueMatches = check.mappedValue === Number(check.envValue);
    } else if (check.expectedType === 'boolean') {
      valueMatches = check.mappedValue === (check.envValue === 'true');
    } else {
      valueMatches = check.mappedValue === check.envValue;
    }

    const status = typeMatches && valueMatches ? '✅ PASS' : '❌ FAIL';
    
    if (typeMatches && valueMatches) {
      passCount++;
    } else {
      failCount++;
    }

    console.log(`${status} | ${check.name}`);
    console.log(`   Description: ${check.description}`);
    console.log(`   .env value: "${check.envValue}" (${typeof check.envValue})`);
    console.log(`   Mapped value: ${JSON.stringify(check.mappedValue)} (${actualType})`);
    console.log(`   Expected type: ${check.expectedType}`);
    
    if (!typeMatches || !valueMatches) {
      if (!typeMatches) {
        console.log(`   ⚠️  Type mismatch: expected ${check.expectedType}, got ${actualType}`);
      }
      if (!valueMatches) {
        console.log(`   ⚠️  Value mismatch`);
      }
    }
    console.log('');
  });

  console.log('=== Summary ===');
  console.log(`Total checks: ${checks.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log('');

  if (failCount === 0) {
    console.log('🎉 All environment variables are correctly mapped and working!');
  } else {
    console.log('⚠️  Some environment variables have mapping issues. Please review above.');
    process.exit(1);
  }
}

// Run verification
verifyEnvironmentVariables();
