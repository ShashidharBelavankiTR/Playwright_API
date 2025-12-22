import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/ConfigManager';
import { LogLevel } from '../types';

/**
 * Logger utility class for comprehensive logging
 * Supports console and file logging with different log levels
 */
export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private logDir: string = 'reports/logs';

  private constructor() {
    this.ensureLogDirectoryExists();
    this.logger = this.createLogger();
  }

  /**
   * Get singleton instance of Logger
   * @returns Logger instance
   */
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectoryExists(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Create Winston logger instance
   * @returns Winston logger
   */
  private createLogger(): winston.Logger {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return stack
          ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
          : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    );

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ];

    // Add file transport if configured
    if (config.get('logToFile')) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      transports.push(
        new winston.transports.File({
          filename: path.join(this.logDir, `test-${timestamp}.log`),
          format: logFormat,
        })
      );
      transports.push(
        new winston.transports.File({
          filename: path.join(this.logDir, `error-${timestamp}.log`),
          level: 'error',
          format: logFormat,
        })
      );
    }

    return winston.createLogger({
      level: config.get('logLevel'),
      format: logFormat,
      transports,
    });
  }

  /**
   * Log error message
   * @param message Error message
   * @param meta Additional metadata
   */
  public error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  /**
   * Log warning message
   * @param message Warning message
   * @param meta Additional metadata
   */
  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  /**
   * Log info message
   * @param message Info message
   * @param meta Additional metadata
   */
  public info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  /**
   * Log debug message
   * @param message Debug message
   * @param meta Additional metadata
   */
  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  /**
   * Log a test step
   * @param stepName Name of the test step
   * @param status Status (STARTED/PASSED/FAILED)
   */
  public logStep(stepName: string, status: 'STARTED' | 'PASSED' | 'FAILED'): void {
    const message = `Test Step [${stepName}] - ${status}`;
    if (status === 'FAILED') {
      this.error(message);
    } else {
      this.info(message);
    }
  }

  /**
   * Log an action performed
   * @param action Action description
   * @param element Element selector
   */
  public logAction(action: string, element?: string): void {
    const message = element
      ? `Action: ${action} on element [${element}]`
      : `Action: ${action}`;
    this.info(message);
  }

  /**
   * Log API request
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param data Request data
   */
  public logAPIRequest(method: string, endpoint: string, data?: any): void {
    this.info(`API Request: ${method} ${endpoint}`, data ? { data } : undefined);
  }

  /**
   * Log API response
   * @param method HTTP method
   * @param endpoint API endpoint
   * @param status Response status
   * @param responseData Response data
   */
  public logAPIResponse(
    method: string,
    endpoint: string,
    status: number,
    responseData?: any
  ): void {
    this.info(`API Response: ${method} ${endpoint} - Status: ${status}`, {
      data: responseData,
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
