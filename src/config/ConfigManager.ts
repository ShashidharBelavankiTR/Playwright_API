import * as dotenv from 'dotenv';
import { IConfig } from '../types';

// Load environment variables
dotenv.config();

/**
 * ConfigManager - Singleton class to manage application configuration
 * Loads and provides type-safe access to environment variables
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: IConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  /**
   * Get singleton instance of ConfigManager
   * @returns ConfigManager instance
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from environment variables
   * @returns IConfig object with all configuration values
   */
  private loadConfig(): IConfig {
    return {
      environment: process.env.ENVIRONMENT || 'dev',
      baseUrl: process.env.BASE_URL || 'https://example.com',
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
      defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
      navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
      actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
      headless: process.env.HEADLESS === 'true',
      browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
      viewportWidth: Number(process.env.VIEWPORT_WIDTH) || 1920,
      viewportHeight: Number(process.env.VIEWPORT_HEIGHT) || 1080,
      parallelWorkers: Number(process.env.PARALLEL_WORKERS) || 4,
      retries: Number(process.env.RETRIES) || 0,
      slowMo: Number(process.env.SLOW_MO) || 0,
      logLevel: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
      logToFile: process.env.LOG_TO_FILE === 'true',
      screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE === 'true',
      screenshotOnSuccess: process.env.SCREENSHOT_ON_SUCCESS === 'true',
      videoOnFailure: process.env.VIDEO_ON_FAILURE || 'retain-on-failure',
      apiTimeout: Number(process.env.API_TIMEOUT) || 30000,
      apiMaxRetries: Number(process.env.API_MAX_RETRIES) || 3,
    };
  }

  /**
   * Validate required configuration values
   * @throws Error if required configuration is missing
   */
  private validateConfig(): void {
    const requiredFields: (keyof IConfig)[] = ['baseUrl', 'apiBaseUrl', 'environment'];
    const missingFields = requiredFields.filter((field) => !this.config[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required configuration fields: ${missingFields.join(', ')}`
      );
    }
  }

  /**
   * Get the complete configuration object
   * @returns Complete IConfig object
   */
  public getConfig(): IConfig {
    return { ...this.config };
  }

  /**
   * Get a specific configuration value
   * @param key Configuration key
   * @returns Configuration value
   */
  public get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.config[key];
  }

  /**
   * Get environment name
   * @returns Environment string (dev/staging/prod)
   */
  public getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Get base URL
   * @returns Base URL for UI testing
   */
  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Get API base URL
   * @returns Base URL for API testing
   */
  public getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  /**
   * Check if running in production environment
   * @returns true if production, false otherwise
   */
  public isProduction(): boolean {
    return this.config.environment === 'prod';
  }

  /**
   * Check if running in headless mode
   * @returns true if headless, false otherwise
   */
  public isHeadless(): boolean {
    return this.config.headless;
  }

  /**
   * Get browser type
   * @returns Browser type (chromium/firefox/webkit)
   */
  public getBrowser(): 'chromium' | 'firefox' | 'webkit' {
    return this.config.browser;
  }

  /**
   * Get viewport dimensions
   * @returns Object with width and height
   */
  public getViewport(): { width: number; height: number } {
    return {
      width: this.config.viewportWidth,
      height: this.config.viewportHeight,
    };
  }

  /**
   * Get timeout values
   * @returns Object with all timeout values
   */
  public getTimeouts(): {
    default: number;
    navigation: number;
    action: number;
    api: number;
  } {
    return {
      default: this.config.defaultTimeout,
      navigation: this.config.navigationTimeout,
      action: this.config.actionTimeout,
      api: this.config.apiTimeout,
    };
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance();
