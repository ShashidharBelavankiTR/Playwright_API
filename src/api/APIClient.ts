import { APIRequestContext, APIResponse, test } from '@playwright/test';
import { logger } from '../utils/Logger';
import { config } from '../config/ConfigManager';
import { RequestOptions, APIException } from '../types';

/**
 * APIClient - Base class for API testing
 * Provides all HTTP methods with comprehensive error handling and logging
 */
export class APIClient {
  protected readonly request: APIRequestContext;
  protected readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.baseURL = baseURL || config.getApiBaseUrl();
  }

  /**
   * Build full URL from endpoint
   * @param endpoint API endpoint
   * @returns Full URL
   */
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }

  /**
   * Build request headers
   * @param customHeaders Custom headers to merge
   * @returns Complete headers object
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    return { ...defaultHeaders, ...customHeaders };
  }

  /**
   * Handle API response and errors
   * @param response API response
   * @param method HTTP method
   * @param endpoint API endpoint
   * @returns Response object
   */
  private async handleResponse(
    response: APIResponse,
    method: string,
    endpoint: string
  ): Promise<APIResponse> {
    const status = response.status();
    let responseBody: any;

    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text();
    }

    logger.logAPIResponse(method, endpoint, status, responseBody);

    if (!response.ok()) {
      throw new APIException(
        `API ${method} ${endpoint} failed with status ${status}`,
        status
      );
    }

    return response;
  }

  /**
   * Perform GET request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns API response
   */
  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return await test.step(`GET ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('GET', url);

        const response = await this.request.get(url, {
          headers,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'GET', endpoint);
      } catch (error) {
        logger.error(`GET ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform POST request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns API response
   */
  async post(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse> {
    return await test.step(`POST ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('POST', url, data);

        const response = await this.request.post(url, {
          headers,
          data,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'POST', endpoint);
      } catch (error) {
        logger.error(`POST ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform PUT request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns API response
   */
  async put(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse> {
    return await test.step(`PUT ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('PUT', url, data);

        const response = await this.request.put(url, {
          headers,
          data,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'PUT', endpoint);
      } catch (error) {
        logger.error(`PUT ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform PATCH request
   * @param endpoint API endpoint
   * @param data Request body data
   * @param options Request options
   * @returns API response
   */
  async patch(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse> {
    return await test.step(`PATCH ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('PATCH', url, data);

        const response = await this.request.patch(url, {
          headers,
          data,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'PATCH', endpoint);
      } catch (error) {
        logger.error(`PATCH ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform DELETE request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns API response
   */
  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return await test.step(`DELETE ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('DELETE', url);

        const response = await this.request.delete(url, {
          headers,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'DELETE', endpoint);
      } catch (error) {
        logger.error(`DELETE ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform HEAD request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns API response
   */
  async head(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return await test.step(`HEAD ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('HEAD', url);

        const response = await this.request.head(url, {
          headers,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'HEAD', endpoint);
      } catch (error) {
        logger.error(`HEAD ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }

  /**
   * Perform OPTIONS request
   * @param endpoint API endpoint
   * @param options Request options
   * @returns API response
   */
  async options(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return await test.step(`OPTIONS ${endpoint}`, async () => {
      try {
        const url = this.buildUrl(endpoint);
        const headers = this.buildHeaders(options?.headers);

        logger.logAPIRequest('OPTIONS', url);

        const response = await this.request.fetch(url, {
          method: 'OPTIONS',
          headers,
          params: options?.params,
          timeout: options?.timeout || config.get('apiTimeout'),
        });

        return await this.handleResponse(response, 'OPTIONS', endpoint);
      } catch (error) {
        logger.error(`OPTIONS ${endpoint} failed: ${(error as Error).message}`);
        throw error;
      }
    });
  }
}
