import * as fs from 'fs';
import * as path from 'path';
import { ITestData, TestDataException } from '../types';
import { logger } from './Logger';

/**
 * TestDataManager - Manages reading and caching of test data from JSON files
 * Implements caching mechanism to avoid repeated file reads
 */
export class TestDataManager {
  private static instance: TestDataManager;
  private cache: Map<string, ITestData> = new Map();
  private testDataDir: string = 'test-data';

  private constructor() {
    this.ensureTestDataDirectoryExists();
  }

  /**
   * Get singleton instance of TestDataManager
   * @returns TestDataManager instance
   */
  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Ensure test data directory exists
   */
  private ensureTestDataDirectoryExists(): void {
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
      logger.info(`Created test-data directory: ${this.testDataDir}`);
    }
  }

  /**
   * Get the full path to a test data file
   * @param fileName Name of the JSON file
   * @returns Full file path
   */
  private getFilePath(fileName: string): string {
    // Add .json extension if not present
    const fileNameWithExtension = fileName.endsWith('.json')
      ? fileName
      : `${fileName}.json`;
    return path.join(this.testDataDir, fileNameWithExtension);
  }

  /**
   * Read and parse JSON file
   * @param filePath Full path to JSON file
   * @returns Parsed JSON data
   * @throws TestDataException if file is invalid or not found
   */
  private readJsonFile(filePath: string): ITestData {
    try {
      if (!fs.existsSync(filePath)) {
        throw new TestDataException(`Test data file not found: ${filePath}`);
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      logger.debug(`Successfully loaded test data from: ${filePath}`);
      return data;
    } catch (error) {
      if (error instanceof TestDataException) {
        throw error;
      }
      throw new TestDataException(
        `Failed to read or parse test data file: ${filePath}. Error: ${
          (error as Error).message
        }`
      );
    }
  }

  /**
   * Get all data from a JSON file
   * @param fileName Name of the JSON file (with or without .json extension)
   * @returns Complete test data object
   */
  public getAllData<T = ITestData>(fileName: string): T {
    const filePath = this.getFilePath(fileName);

    // Check cache first
    if (this.cache.has(filePath)) {
      logger.debug(`Retrieved test data from cache: ${fileName}`);
      return this.cache.get(filePath) as T;
    }

    // Read from file and cache
    const data = this.readJsonFile(filePath);
    this.cache.set(filePath, data);
    return data as T;
  }

  /**
   * Get specific data by key from a JSON file
   * @param fileName Name of the JSON file
   * @param key Key to retrieve from the JSON object
   * @returns Data associated with the key
   */
  public getData<T = any>(fileName: string, key: string): T {
    const allData = this.getAllData(fileName);

    if (!(key in allData)) {
      throw new TestDataException(
        `Key '${key}' not found in test data file: ${fileName}`
      );
    }

    return allData[key] as T;
  }

  /**
   * Get nested data using dot notation
   * Example: getData('users', 'admin.credentials.username')
   * @param fileName Name of the JSON file
   * @param keyPath Dot-separated key path
   * @returns Nested data value
   */
  public getNestedData<T = any>(fileName: string, keyPath: string): T {
    const allData = this.getAllData(fileName);
    const keys = keyPath.split('.');

    let result: any = allData;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        throw new TestDataException(
          `Key path '${keyPath}' not found in test data file: ${fileName}`
        );
      }
    }

    return result as T;
  }

  /**
   * Check if a key exists in test data
   * @param fileName Name of the JSON file
   * @param key Key to check
   * @returns true if key exists, false otherwise
   */
  public hasKey(fileName: string, key: string): boolean {
    try {
      const allData = this.getAllData(fileName);
      return key in allData;
    } catch {
      return false;
    }
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    logger.debug('Test data cache cleared');
  }

  /**
   * Clear cached data for a specific file
   * @param fileName Name of the JSON file
   */
  public clearFileCache(fileName: string): void {
    const filePath = this.getFilePath(fileName);
    this.cache.delete(filePath);
    logger.debug(`Cleared cache for file: ${fileName}`);
  }

  /**
   * Reload data from file (bypassing cache)
   * @param fileName Name of the JSON file
   * @returns Fresh test data
   */
  public reloadData<T = ITestData>(fileName: string): T {
    this.clearFileCache(fileName);
    return this.getAllData<T>(fileName);
  }

  /**
   * Get list of all test data files
   * @returns Array of test data file names
   */
  public getAvailableDataFiles(): string[] {
    try {
      const files = fs.readdirSync(this.testDataDir);
      return files.filter((file) => file.endsWith('.json'));
    } catch (error) {
      logger.error(`Failed to read test data directory: ${(error as Error).message}`);
      return [];
    }
  }
}

// Export singleton instance
export const testDataManager = TestDataManager.getInstance();
