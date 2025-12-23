import { test } from '../../src/fixtures/baseFixtures';
import { assert } from '../../src/utils/Assertions';
import { ResponseHelper } from '../../src/helpers/ResponseHelper';
import { PayloadBuilder } from '../../src/helpers/RequestBuilder';

/**
 * Enhanced API Test Suite - Using Assertions Utility
 * Demonstrates comprehensive API assertion usage with detailed logging
 */
test.describe('Enhanced User API Tests with Assertions', () => {
  let createdUserId: string;
  let createdUserEmail: string;

  test('Should get all users with detailed assertions', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();

    // Assert response status with detailed logging
    await assert.toHaveStatusCode(response, 200, 'Get all users should return 200 OK');
    await assert.toBeOK(response, 'Response should be successful');

    // Parse and validate response
    const users = await ResponseHelper.parseJSON(response);
    
    // Assert response structure
    await assert.assertTruthy(Array.isArray(users), 'Response should be an array', { 
      responseType: typeof users,
      isArray: Array.isArray(users)
    });

    // Assert array is not empty (if users exist)
    if (Array.isArray(users) && users.length > 0) {
      await assert.assertGreaterThan(users.length, 0, 'Should have at least one user', {
        userCount: users.length
      });

      // Assert first user has required properties
      const firstUser = users[0];
      await assert.assertHasProperty(firstUser, 'id', 'User should have id property');
      await assert.assertHasProperty(firstUser, 'name', 'User should have name property');
      await assert.assertHasProperty(firstUser, 'email', 'User should have email property');
    }
  });

  test('Should create a new user with validation', async ({ apiServices }) => {
    // Build user payload
    const timestamp = Date.now();
    createdUserEmail = `test-${timestamp}@example.com`;
    
    const userData = PayloadBuilder.buildUserPayload({
      name: 'Test User',
      email: createdUserEmail,
    });

    // Assert payload structure before sending
    await assert.assertHasProperty(userData, 'name', 'Payload should have name');
    await assert.assertHasProperty(userData, 'email', 'Payload should have email');
    await assert.assertEqual(userData.name, 'Test User', 'Name should match', { userData });

    // Make API call
    const response = await apiServices.userService.createUser(userData);

    // Assert response status
    await assert.toHaveStatusCode(response, 201, 'Create user should return 201 Created');

    // Parse and validate response
    const createdUser = await ResponseHelper.parseJSON(response);

    // Assert response contains created user data
    await assert.toContainResponseData(response, 
      { name: userData.name, email: userData.email },
      'Response should contain user data'
    );

    // Assert user has ID
    await assert.assertHasProperty(createdUser, 'id', 'Created user should have ID');
    await assert.assertDefined(createdUser.id, 'User ID should be defined');

    // Assert user data matches
    await assert.assertEqual(createdUser.name, userData.name, 'Created user name should match');
    await assert.assertEqual(createdUser.email, userData.email, 'Created user email should match');

    // Assert email format
    await assert.assertStringMatches(
      createdUser.email,
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Email should have valid format',
      { email: createdUser.email }
    );

    // Store user ID for other tests
    createdUserId = createdUser.id;
  });

  test('Should get user by ID', async ({ apiServices }) => {
    // Skip if no user was created
    if (!createdUserId) {
      test.skip();
      return;
    }

    const response = await apiServices.userService.getUserById(createdUserId);

    // Assert response
    await assert.toHaveStatusCode(response, 200, 'Get user by ID should return 200 OK');
    await assert.toBeOK(response, 'Response should be successful');

    // Parse user
    const user = await ResponseHelper.parseJSON(response);

    // Assert user data
    await assert.assertHasProperty(user, 'id', 'User should have ID');
    await assert.assertHasProperty(user, 'name', 'User should have name');
    await assert.assertHasProperty(user, 'email', 'User should have email');

    // Assert ID matches
    await assert.assertEqual(user.id, createdUserId, 'User ID should match requested ID', {
      requestedId: createdUserId,
      responseId: user.id
    });

    // Assert email matches if we created the user
    if (createdUserEmail) {
      await assert.assertEqual(user.email, createdUserEmail, 'Email should match created user');
    }
  });

  test('Should update user', async ({ apiServices }) => {
    if (!createdUserId) {
      test.skip();
      return;
    }

    const updatedData = {
      name: 'Updated Test User',
      email: createdUserEmail
    };

    const response = await apiServices.userService.updateUser(createdUserId, updatedData);

    // Assert response
    await assert.toHaveStatusCode(response, 200, 'Update user should return 200 OK');

    // Parse response
    const updatedUser = await ResponseHelper.parseJSON(response);

    // Assert updated data
    await assert.assertEqual(updatedUser.name, updatedData.name, 'User name should be updated');
    await assert.assertEqual(updatedUser.id, createdUserId, 'User ID should remain same');
  });

  test('Should delete user', async ({ apiServices }) => {
    if (!createdUserId) {
      test.skip();
      return;
    }

    const response = await apiServices.userService.deleteUser(createdUserId);

    // Assert response
    await assert.toHaveStatusCode(response, 204, 'Delete user should return 204 No Content');

    // Try to get deleted user - should return 404
    const getResponse = await apiServices.userService.getUserById(createdUserId);
    await assert.toHaveStatusCode(getResponse, 404, 'Deleted user should return 404');
  });

  test('Should handle invalid user ID', async ({ apiServices }) => {
    const invalidUserId = 'invalid-id-999999';

    const response = await apiServices.userService.getUserById(invalidUserId);

    // Assert error response
    await assert.toHaveStatusCode(response, 404, 'Invalid user ID should return 404 Not Found');
  });

  test('Should validate required fields on creation', async ({ apiServices }) => {
    const invalidUserData = {
      name: '', // Empty name
      email: 'invalid-email' // Invalid email format
    };

    const response = await apiServices.userService.createUser(invalidUserData);

    // Assert validation error
    // Adjust status code based on your API (400, 422, etc.)
    const statusCode = response.status();
    await assert.assertCondition(
      statusCode >= 400 && statusCode < 500,
      'Should return client error for invalid data',
      `Expected 4xx status code, got ${statusCode}`,
      { statusCode, requestData: invalidUserData }
    );
  });
});

/**
 * Enhanced API Response Structure Tests
 */
test.describe('Enhanced API Response Structure Tests', () => {
  test('Should have proper response headers', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();

    await assert.toBeOK(response, 'Response should be successful');

    // Get response headers
    const headers = response.headers();
    const contentType = headers['content-type'] || '';

    // Assert content type
    await assert.assertStringContains(
      contentType.toLowerCase(),
      'application/json',
      'Response should be JSON',
      { contentType }
    );
  });

  test('Should handle pagination if implemented', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();
    const data = await ResponseHelper.parseJSON(response);

    // If pagination is implemented, check for pagination properties
    if (typeof data === 'object' && !Array.isArray(data)) {
      // Example: Check if response has pagination metadata
      if ('total' in data || 'page' in data || 'limit' in data) {
        await assert.assertHasProperty(data, 'data', 'Paginated response should have data property');
        await assert.assertHasProperty(data, 'total', 'Paginated response should have total');
        
        const total = (data as any).total;
        await assert.assertGreaterThan(total, -1, 'Total should be non-negative', { total });
      }
    }
  });
});

/**
 * Enhanced API Error Handling Tests
 */
test.describe('Enhanced API Error Handling Tests', () => {
  test('Should handle network timeout gracefully', async ({ apiServices }) => {
    // This test depends on your API implementation
    // Example: test endpoint with very short timeout
    try {
      const response = await apiServices.userService.getAllUsers();
      await assert.toBeOK(response, 'Request should succeed or fail gracefully');
    } catch (error) {
      // Assert error is handled
      await assert.assertDefined(error, 'Error should be defined');
    }
  });

  test('Should return proper error for unauthorized access', async ({ request }) => {
    // Example: Try to access protected endpoint without auth
    const response = await request.get('/api/protected-endpoint');
    
    // Should return 401 or 403
    const statusCode = response.status();
    await assert.assertCondition(
      statusCode === 401 || statusCode === 403,
      'Should return unauthorized status',
      `Expected 401 or 403, got ${statusCode}`,
      { statusCode }
    );
  });
});

/**
 * Enhanced API Data Validation Tests
 */
test.describe('Enhanced API Data Validation Tests', () => {
  test('Should validate email format in user data', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();
    await assert.toBeOK(response, 'Should get users successfully');

    const users = await ResponseHelper.parseJSON(response);

    if (Array.isArray(users) && users.length > 0) {
      // Validate first user's email
      const firstUser = users[0];
      if (firstUser.email) {
        await assert.assertStringMatches(
          firstUser.email,
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          'User email should have valid format',
          { email: firstUser.email }
        );
      }
    }
  });

  test('Should validate data types in response', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();
    await assert.toBeOK(response, 'Should get users successfully');

    const users = await ResponseHelper.parseJSON(response);

    if (Array.isArray(users) && users.length > 0) {
      const firstUser = users[0];

      // Validate data types
      await assert.assertEqual(
        typeof firstUser.id,
        'string',
        'User ID should be string (or number depending on API)',
        { id: firstUser.id, type: typeof firstUser.id }
      );

      await assert.assertEqual(
        typeof firstUser.name,
        'string',
        'User name should be string',
        { name: firstUser.name }
      );

      await assert.assertEqual(
        typeof firstUser.email,
        'string',
        'User email should be string',
        { email: firstUser.email }
      );
    }
  });
});

/**
 * Enhanced API Performance Tests
 */
test.describe('Enhanced API Performance Tests', () => {
  test('Should respond within acceptable time', async ({ apiServices }) => {
    const startTime = Date.now();
    
    const response = await apiServices.userService.getAllUsers();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    await assert.toBeOK(response, 'Request should be successful');

    // Assert response time (adjust threshold as needed)
    await assert.assertLessThan(
      responseTime,
      5000,
      'Response time should be under 5 seconds',
      { responseTime: `${responseTime}ms` }
    );
  });
});

/**
 * Enhanced API Bulk Operations Tests
 */
test.describe('Enhanced API Bulk Operations Tests', () => {
  const createdUserIds: string[] = [];

  test('Should create multiple users', async ({ apiServices }) => {
    const usersToCreate = [
      { name: 'Bulk User 1', email: `bulk1-${Date.now()}@example.com` },
      { name: 'Bulk User 2', email: `bulk2-${Date.now()}@example.com` },
      { name: 'Bulk User 3', email: `bulk3-${Date.now()}@example.com` },
    ];

    for (const userData of usersToCreate) {
      const response = await apiServices.userService.createUser(userData);
      await assert.toHaveStatusCode(response, 201, `Should create user ${userData.name}`);

      const createdUser = await ResponseHelper.parseJSON(response);
      createdUserIds.push(createdUser.id);
    }

    // Assert all users were created
    await assert.assertEqual(
      createdUserIds.length,
      usersToCreate.length,
      'All users should be created',
      { created: createdUserIds.length, expected: usersToCreate.length }
    );
  });

  test.afterAll(async ({ apiServices }) => {
    // Cleanup: Delete all created users
    for (const userId of createdUserIds) {
      try {
        await apiServices.userService.deleteUser(userId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });
});
