import { faker } from '@faker-js/faker';

/**
 * RequestBuilder - Builder pattern for constructing API request payloads
 * Provides fluent interface for building complex request bodies
 */
export class RequestBuilder {
  private method: string = 'GET';
  private endpoint: string = '';
  private headers: Record<string, string> = {};
  private queryParams: Record<string, string | number> = {};
  private body: any = null;

  /**
   * Set HTTP method
   * @param method HTTP method
   * @returns RequestBuilder instance
   */
  setMethod(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'): RequestBuilder {
    this.method = method;
    return this;
  }

  /**
   * Set endpoint
   * @param endpoint API endpoint
   * @returns RequestBuilder instance
   */
  setEndpoint(endpoint: string): RequestBuilder {
    this.endpoint = endpoint;
    return this;
  }

  /**
   * Set headers
   * @param headers Headers object
   * @returns RequestBuilder instance
   */
  setHeaders(headers: Record<string, string>): RequestBuilder {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Add single header
   * @param key Header key
   * @param value Header value
   * @returns RequestBuilder instance
   */
  addHeader(key: string, value: string): RequestBuilder {
    this.headers[key] = value;
    return this;
  }

  /**
   * Set query parameters
   * @param params Query parameters object
   * @returns RequestBuilder instance
   */
  setQueryParams(params: Record<string, string | number>): RequestBuilder {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  /**
   * Add single query parameter
   * @param key Parameter key
   * @param value Parameter value
   * @returns RequestBuilder instance
   */
  addQueryParam(key: string, value: string | number): RequestBuilder {
    this.queryParams[key] = value;
    return this;
  }

  /**
   * Set request body
   * @param body Request body
   * @returns RequestBuilder instance
   */
  setBody(body: any): RequestBuilder {
    this.body = body;
    return this;
  }

  /**
   * Set authorization token
   * @param token Bearer token
   * @returns RequestBuilder instance
   */
  setAuthToken(token: string): RequestBuilder {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  /**
   * Build and return the request configuration
   * @returns Request configuration object
   */
  build(): {
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    params: Record<string, string | number>;
    body: any;
  } {
    return {
      method: this.method,
      endpoint: this.endpoint,
      headers: this.headers,
      params: this.queryParams,
      body: this.body,
    };
  }

  /**
   * Reset builder to initial state
   * @returns RequestBuilder instance
   */
  reset(): RequestBuilder {
    this.method = 'GET';
    this.endpoint = '';
    this.headers = {};
    this.queryParams = {};
    this.body = null;
    return this;
  }
}

/**
 * PayloadBuilder - Helper class for building request payloads
 * Includes dynamic data generation using Faker
 */
export class PayloadBuilder {
  /**
   * Build user creation payload
   * @param overrides Optional field overrides
   * @returns User payload
   */
  static buildUserPayload(overrides?: Partial<any>): any {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      ...overrides,
    };
  }

  /**
   * Build product payload
   * @param overrides Optional field overrides
   * @returns Product payload
   */
  static buildProductPayload(overrides?: Partial<any>): any {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(10).toUpperCase(),
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 1000 }),
      ...overrides,
    };
  }

  /**
   * Build order payload
   * @param overrides Optional field overrides
   * @returns Order payload
   */
  static buildOrderPayload(overrides?: Partial<any>): any {
    return {
      orderId: faker.string.uuid(),
      customerId: faker.string.uuid(),
      items: [
        {
          productId: faker.string.uuid(),
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: parseFloat(faker.commerce.price()),
        },
      ],
      totalAmount: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      orderDate: faker.date.recent().toISOString(),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
      ...overrides,
    };
  }

  /**
   * Build generic payload from template
   * @param template Template object with field generators
   * @returns Generated payload
   */
  static buildFromTemplate(template: Record<string, () => any>): any {
    const payload: any = {};
    for (const [key, generator] of Object.entries(template)) {
      payload[key] = generator();
    }
    return payload;
  }

  /**
   * Build array of payloads
   * @param builder Builder function
   * @param count Number of items to generate
   * @returns Array of payloads
   */
  static buildArray(builder: () => any, count: number): any[] {
    return Array.from({ length: count }, () => builder());
  }
}
