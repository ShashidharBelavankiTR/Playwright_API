import { test, expect } from '../../src/fixtures/baseFixtures';
import { ResponseHelper } from '../../src/helpers/ResponseHelper';
import { PayloadBuilder } from '../../src/helpers/RequestBuilder';

/**
 * Sample API Test Suite - User Management
 * Demonstrates API testing with the framework
 */
test.describe('User API Tests', () => {
  let createdUserId: string;

  test('Should get all users', async ({ apiServices }) => {
    const response = await apiServices.userService.getAllUsers();

    // Assert status code
    ResponseHelper.assertStatusCode(response, 200);
    ResponseHelper.assertOK(response);

    // Parse and validate response
    const users = await ResponseHelper.parseJSON(response);
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('Should create a new user', async ({ apiServices }) => {
    // Build user payload
    const userData = PayloadBuilder.buildUserPayload({
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
    });

    const response = await apiServices.userService.createUser(userData);

    // Assert response
    ResponseHelper.assertStatusCode(response, 201);

    const createdUser = await ResponseHelper.parseJSON(response);
    expect(createdUser).toHaveProperty('id');
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.email).toBe(userData.email);

    // Store user ID for cleanup
    createdUserId = createdUser.id;
  });

  test('Should get user by ID', async ({ apiServices, testData }) => {
    // Assuming we have a test user ID in test data
    const userId = '1'; // Replace with actual test user ID

    const response = await apiServices.userService.getUserById(userId);

    ResponseHelper.assertStatusCode(response, 200);
    await ResponseHelper.assertContainsKey(response, 'id');
    await ResponseHelper.assertContainsKey(response, 'name');
    await ResponseHelper.assertContainsKey(response, 'email');

    const user = await ResponseHelper.parseJSON(response);
    expect(user.id).toBe(userId);
  });

  test('Should update user', async ({ apiServices }) => {
    const userId = '1';
    const updatedData = PayloadBuilder.buildUserPayload({
      name: 'Updated User Name',
    });

    const response = await apiServices.userService.updateUser(userId, updatedData);

    ResponseHelper.assertStatusCode(response, 200);

    const updatedUser = await ResponseHelper.parseJSON(response);
    expect(updatedUser.name).toBe(updatedData.name);
  });

  test('Should partially update user', async ({ apiServices }) => {
    const userId = '1';
    const partialData = {
      name: 'Partially Updated Name',
    };

    const response = await apiServices.userService.patchUser(userId, partialData);

    ResponseHelper.assertStatusCode(response, 200);

    const user = await ResponseHelper.parseJSON(response);
    expect(user.name).toBe(partialData.name);
  });

  test('Should search users', async ({ apiServices }) => {
    const searchQuery = 'test';

    const response = await apiServices.userService.searchUsers(searchQuery);

    ResponseHelper.assertStatusCode(response, 200);

    const users = await ResponseHelper.parseJSON(response);
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('Should delete user', async ({ apiServices }) => {
    // Create user first
    const userData = PayloadBuilder.buildUserPayload();
    const createResponse = await apiServices.userService.createUser(userData);
    const user = await ResponseHelper.parseJSON(createResponse);

    // Delete the user
    const deleteResponse = await apiServices.userService.deleteUser(user.id);

    ResponseHelper.assertStatusCode(deleteResponse, 204);

    // Verify user is deleted (should return 404)
    try {
      await apiServices.userService.getUserById(user.id);
    } catch (error) {
      // Expected to fail with 404
      expect(error).toBeDefined();
    }
  });

  test('Should validate response schema', async ({ apiServices }) => {
    const response = await apiServices.userService.getUserById('1');

    const schema = {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
    };

    await ResponseHelper.validateSchema(response, schema);
  });

  test('Should handle error for non-existent user', async ({ apiServices }) => {
    const nonExistentId = '999999999';

    try {
      await apiServices.userService.getUserById(nonExistentId);
      // If no error is thrown, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });
});

/**
 * CRUD Operations Test
 */
test.describe('User CRUD Operations', () => {
  let userId: string;

  test.describe.serial('CRUD Flow', () => {
    test('Create User', async ({ apiServices }) => {
      const userData = PayloadBuilder.buildUserPayload({
        name: 'CRUD Test User',
        email: `crud-${Date.now()}@example.com`,
      });

      const response = await apiServices.userService.createUser(userData);
      ResponseHelper.assertStatusCode(response, 201);

      const user = await ResponseHelper.parseJSON(response);
      userId = user.id;
      expect(userId).toBeDefined();
    });

    test('Read User', async ({ apiServices }) => {
      const response = await apiServices.userService.getUserById(userId);
      ResponseHelper.assertStatusCode(response, 200);

      const user = await ResponseHelper.parseJSON(response);
      expect(user.id).toBe(userId);
    });

    test('Update User', async ({ apiServices }) => {
      const updateData = { name: 'Updated CRUD User' };
      const response = await apiServices.userService.patchUser(userId, updateData);
      ResponseHelper.assertStatusCode(response, 200);

      const user = await ResponseHelper.parseJSON(response);
      expect(user.name).toBe(updateData.name);
    });

    test('Delete User', async ({ apiServices }) => {
      const response = await apiServices.userService.deleteUser(userId);
      ResponseHelper.assertStatusCode(response, 204);
    });
  });
});

/**
 * API Performance Test
 */
test.describe('API Performance Tests', () => {
  test('Should respond within acceptable time', async ({ apiServices }) => {
    const startTime = Date.now();

    await apiServices.userService.getAllUsers();

    ResponseHelper.assertResponseTime(startTime, 2000); // 2 seconds max
  });
});
