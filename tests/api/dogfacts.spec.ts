import { test, expect } from '../../src/fixtures/baseFixtures';
import { logger } from '../../src/utils/Logger';

/**
 * Dog Facts API Tests
 * Tests for the Dog API endpoint: https://dogapi.dog/api/v1/facts?number=1
 */
test.describe('Dog Facts API Tests', () => {
  test('Should get a single dog fact', async ({ apiServices }) => {
    // Get one dog fact
    const response = await apiServices.dogFactsService.getDogFacts(1);

    // Validate response
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse response body
    const body = await response.json();
    logger.info(`Dog Fact: ${JSON.stringify(body)}`);

    // Validate response structure
    expect(body).toHaveProperty('facts');
    expect(body).toHaveProperty('success');
    expect(Array.isArray(body.facts)).toBeTruthy();
    expect(body.facts.length).toBe(1);
    expect(body.success).toBe(true);

    // Validate fact content
    const fact = body.facts[0];
    expect(typeof fact).toBe('string');
    expect(fact.length).toBeGreaterThan(0);

    logger.info(`Fact content: ${fact}`);
  });

  test('Should get multiple dog facts', async ({ apiServices }) => {
    // Get three dog facts
    const response = await apiServices.dogFactsService.getDogFacts(3);

    // Validate response
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse response body
    const body = await response.json();

    // Validate response structure
    expect(body).toHaveProperty('facts');
    expect(body).toHaveProperty('success');
    expect(Array.isArray(body.facts)).toBeTruthy();
    expect(body.facts.length).toBe(3);
    expect(body.success).toBe(true);

    // Validate each fact
    body.facts.forEach((fact: string, index: number) => {
      expect(typeof fact).toBe('string');
      expect(fact.length).toBeGreaterThan(0);
      logger.info(`Fact ${index + 1}: ${fact}`);
    });
  });

  test('Should have valid response headers', async ({ apiServices }) => {
    const response = await apiServices.dogFactsService.getDogFacts(1);

    // Validate response headers
    expect(response.status()).toBe(200);
    const headers = response.headers();
    
    expect(headers['content-type']).toContain('application/json');
    logger.info('Response headers validated successfully');
  });

  test('Should respond within acceptable time', async ({ apiServices }) => {
    const startTime = Date.now();
    
    const response = await apiServices.dogFactsService.getDogFacts(1);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(3000); // Should respond within 3 seconds

    logger.info(`API response time: ${responseTime}ms`);
  });

  test('Should validate response schema', async ({ apiServices }) => {
    const response = await apiServices.dogFactsService.getDogFacts(1);
    const body = await response.json();

    // Validate JSON schema
    expect(body).toMatchObject({
      facts: expect.arrayContaining([
        expect.any(String),
      ]),
      success: expect.any(Boolean),
    });

    expect(body.success).toBe(true);
    expect(body.facts.length).toBeGreaterThan(0);

    logger.info('Response schema validation passed');
  });
});
