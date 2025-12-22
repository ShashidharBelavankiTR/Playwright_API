/**
 * Interface for environment configuration
 */
export interface IConfig {
  environment: string;
  baseUrl: string;
  apiBaseUrl: string;
  defaultTimeout: number;
  navigationTimeout: number;
  actionTimeout: number;
  headless: boolean;
  browser: 'chromium' | 'firefox' | 'webkit';
  viewportWidth: number;
  viewportHeight: number;
  parallelWorkers: number;
  retries: number;
  slowMo: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  logToFile: boolean;
  screenshotOnFailure: boolean;
  screenshotOnSuccess: boolean;
  videoOnFailure: string;
  apiTimeout: number;
  apiMaxRetries: number;
}

/**
 * Test data interface
 */
export interface ITestData {
  [key: string]: any;
}

/**
 * API Request options
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
  maxRetries?: number;
}

/**
 * API Response interface
 */
export interface IAPIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  ok: boolean;
}

/**
 * Click options
 */
export interface ClickOptions {
  button?: 'left' | 'right' | 'middle';
  clickCount?: number;
  delay?: number;
  force?: boolean;
  modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[];
  noWaitAfter?: boolean;
  position?: { x: number; y: number };
  timeout?: number;
  trial?: boolean;
}

/**
 * Custom error types
 */
export class ElementNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ElementNotFoundException';
  }
}

export class TimeoutException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutException';
  }
}

export class APIException extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIException';
  }
}

export class TestDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestDataException';
  }
}

/**
 * Logger levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}
