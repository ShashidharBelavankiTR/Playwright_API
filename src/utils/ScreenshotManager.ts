import * as fs from 'fs';
import * as path from 'path';
import { logger } from './Logger';

/**
 * ScreenshotManager - Manages screenshot capture and organization
 * Provides utilities for taking and organizing screenshots
 */
export class ScreenshotManager {
  private static instance: ScreenshotManager;
  private screenshotDir: string = 'screenshots';
  private testScreenshotDir: string = '';

  private constructor() {
    this.ensureDirectoryExists(this.screenshotDir);
  }

  /**
   * Get singleton instance
   * @returns ScreenshotManager instance
   */
  public static getInstance(): ScreenshotManager {
    if (!ScreenshotManager.instance) {
      ScreenshotManager.instance = new ScreenshotManager();
    }
    return ScreenshotManager.instance;
  }

  /**
   * Ensure directory exists
   * @param dir Directory path
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Get timestamp for file naming
   * @returns Formatted timestamp
   */
  private getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Set test-specific screenshot directory
   * @param testName Test name
   */
  public setTestDirectory(testName: string): void {
    const sanitizedName = testName.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().split('T')[0];
    this.testScreenshotDir = path.join(this.screenshotDir, timestamp, sanitizedName);
    this.ensureDirectoryExists(this.testScreenshotDir);
  }

  /**
   * Get screenshot path
   * @param name Screenshot name
   * @param useTestDir Whether to use test-specific directory
   * @returns Full screenshot path
   */
  public getScreenshotPath(name: string, useTestDir: boolean = true): string {
    const dir = useTestDir && this.testScreenshotDir ? this.testScreenshotDir : this.screenshotDir;
    const timestamp = this.getTimestamp();
    const fileName = `${name}-${timestamp}.png`;
    return path.join(dir, fileName);
  }

  /**
   * Generate screenshot name from step
   * @param stepName Step name
   * @returns Sanitized screenshot name
   */
  public generateName(stepName: string): string {
    return stepName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
  }

  /**
   * Get all screenshots for a test
   * @param testName Test name
   * @returns Array of screenshot paths
   */
  public getTestScreenshots(testName: string): string[] {
    const sanitizedName = testName.replace(/[^a-zA-Z0-9]/g, '-');
    const testDir = path.join(this.screenshotDir, sanitizedName);

    if (!fs.existsSync(testDir)) {
      return [];
    }

    return fs
      .readdirSync(testDir)
      .filter((file) => file.endsWith('.png'))
      .map((file) => path.join(testDir, file));
  }

  /**
   * Clean old screenshots
   * @param daysOld Number of days to keep
   */
  public cleanOldScreenshots(daysOld: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
      const dirs = fs.readdirSync(this.screenshotDir);
      dirs.forEach((dir) => {
        const dirPath = path.join(this.screenshotDir, dir);
        const stats = fs.statSync(dirPath);

        if (stats.isDirectory() && stats.mtime < cutoffDate) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          logger.info(`Cleaned old screenshot directory: ${dirPath}`);
        }
      });
    } catch (error) {
      logger.error(`Failed to clean old screenshots: ${(error as Error).message}`);
    }
  }

  /**
   * Get total screenshot count
   * @returns Number of screenshots
   */
  public getTotalScreenshots(): number {
    let count = 0;
    const walkDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.png')) {
          count++;
        }
      });
    };

    if (fs.existsSync(this.screenshotDir)) {
      walkDir(this.screenshotDir);
    }
    return count;
  }
}

// Export singleton instance
export const screenshotManager = ScreenshotManager.getInstance();
