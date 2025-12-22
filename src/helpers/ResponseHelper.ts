import { APIResponse, expect } from '@playwright/test';
import { logger } from '../utils/Logger';

/**
 * ResponseHelper - Utility class for API response handling
 * Provides methods for parsing, validating, and asserting API responses
 */
export class ResponseHelper {
  /**
   * Parse JSON response
   * @param response API response
   * @returns Parsed JSON object
   */
  static async parseJSON(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch (error) {
      logger.error(`Failed to parse JSON response: ${(error as Error).message}`);
      throw new Error(`JSON parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get response as text
   * @param response API response
   * @returns Response text
   */
  static async getText(response: APIResponse): Promise<string> {
    try {
      return await response.text();
    } catch (error) {
      logger.error(`Failed to get response text: ${(error as Error).message}`);
      throw new Error(`Text parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get response status code
   * @param response API response
   * @returns Status code
   */
  static getStatusCode(response: APIResponse): number {
    return response.status();
  }

  /**
   * Get response headers
   * @param response API response
   * @returns Headers object
   */
  static getHeaders(response: APIResponse): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headersArray().forEach((header) => {
      headers[header.name] = header.value;
    });
    return headers;
  }

  /**
   * Get specific header value
   * @param response API response
   * @param headerName Header name
   * @returns Header value
   */
  static getHeader(response: APIResponse, headerName: string): string | null {
    const headers = this.getHeaders(response);
    return headers[headerName.toLowerCase()] || null;
  }

  /**
   * Extract data from JSON response by key
   * @param response API response
   * @param key Key to extract
   * @returns Extracted data
   */
  static async extractData(response: APIResponse, key: string): Promise<any> {
    const json = await this.parseJSON(response);
    if (!(key in json)) {
      throw new Error(`Key "${key}" not found in response`);
    }
    return json[key];
  }

  /**
   * Extract nested data using dot notation
   * @param response API response
   * @param keyPath Dot-separated key path (e.g., 'data.user.id')
   * @returns Extracted nested data
   */
  static async extractNestedData(response: APIResponse, keyPath: string): Promise<any> {
    const json = await this.parseJSON(response);
    const keys = keyPath.split('.');
    let result = json;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        throw new Error(`Key path "${keyPath}" not found in response`);
      }
    }

    return result;
  }

  /**
   * Assert response status code
   * @param response API response
   * @param expectedStatus Expected status code
   */
  static assertStatusCode(response: APIResponse, expectedStatus: number): void {
    const actualStatus = response.status();
    expect(actualStatus).toBe(expectedStatus);
    logger.info(`Status code assertion passed: ${actualStatus} === ${expectedStatus}`);
  }

  /**
   * Assert response is OK (2xx status)
   * @param response API response
   */
  static assertOK(response: APIResponse): void {
    expect(response.ok()).toBeTruthy();
    logger.info(`Response OK assertion passed: ${response.status()}`);
  }

  /**
   * Assert response contains key
   * @param response API response
   * @param key Key to check
   */
  static async assertContainsKey(response: APIResponse, key: string): Promise<void> {
    const json = await this.parseJSON(response);
    expect(json).toHaveProperty(key);
    logger.info(`Response contains key: ${key}`);
  }

  /**
   * Assert response body matches expected
   * @param response API response
   * @param expected Expected response body
   */
  static async assertBodyMatches(response: APIResponse, expected: any): Promise<void> {
    const actual = await this.parseJSON(response);
    expect(actual).toEqual(expected);
    logger.info('Response body matches expected');
  }

  /**
   * Assert response body contains subset
   * @param response API response
   * @param subset Expected subset
   */
  static async assertBodyContains(response: APIResponse, subset: any): Promise<void> {
    const actual = await this.parseJSON(response);
    expect(actual).toMatchObject(subset);
    logger.info('Response body contains expected subset');
  }

  /**
   * Assert response header exists
   * @param response API response
   * @param headerName Header name
   */
  static assertHeaderExists(response: APIResponse, headerName: string): void {
    const header = this.getHeader(response, headerName);
    expect(header).not.toBeNull();
    logger.info(`Header exists: ${headerName}`);
  }

  /**
   * Assert response header value
   * @param response API response
   * @param headerName Header name
   * @param expectedValue Expected header value
   */
  static assertHeaderValue(
    response: APIResponse,
    headerName: string,
    expectedValue: string
  ): void {
    const actualValue = this.getHeader(response, headerName);
    expect(actualValue).toBe(expectedValue);
    logger.info(`Header ${headerName} value matches: ${expectedValue}`);
  }

  /**
   * Assert response time is within limit
   * @param startTime Request start time
   * @param maxTime Maximum allowed time in ms
   */
  static assertResponseTime(startTime: number, maxTime: number): void {
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(maxTime);
    logger.info(`Response time: ${elapsed}ms (< ${maxTime}ms)`);
  }

  /**
   * Validate response schema
   * @param response API response
   * @param schema JSON schema object
   */
  static async validateSchema(response: APIResponse, schema: any): Promise<void> {
    const json = await this.parseJSON(response);
    // Basic schema validation - can be extended with libraries like Ajv
    for (const key in schema) {
      expect(json).toHaveProperty(key);
      if (schema[key].type) {
        expect(typeof json[key]).toBe(schema[key].type);
      }
    }
    logger.info('Schema validation passed');
  }

  /**
   * Compare two responses
   * @param response1 First API response
   * @param response2 Second API response
   * @returns true if responses match
   */
  static async compareResponses(
    response1: APIResponse,
    response2: APIResponse
  ): Promise<boolean> {
    const json1 = await this.parseJSON(response1);
    const json2 = await this.parseJSON(response2);
    return JSON.stringify(json1) === JSON.stringify(json2);
  }

  /**
   * Log response details
   * @param response API response
   * @param label Optional label for logging
   */
  static async logResponse(response: APIResponse, label: string = 'Response'): Promise<void> {
    const status = response.status();
    const headers = this.getHeaders(response);
    const body = await this.parseJSON(response);

    logger.info(`${label} - Status: ${status}`);
    logger.debug(`${label} - Headers:`, headers);
    logger.debug(`${label} - Body:`, body);
  }
}
