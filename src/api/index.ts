import { APIRequestContext, test } from '@playwright/test';
import { APIClient } from './APIClient';

/**
 * UserAPIService - API service for user-related endpoints
 * Demonstrates API testing with service classes
 */
export class UserAPIService extends APIClient {
  private readonly usersEndpoint = '/users';

  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Get all users
   * @returns API response
   */
  async getAllUsers() {
    return await test.step('Get all users', async () => {
      return await this.get(this.usersEndpoint);
    });
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns API response
   */
  async getUserById(userId: string) {
    return await test.step(`Get user by ID: ${userId}`, async () => {
      return await this.get(`${this.usersEndpoint}/${userId}`);
    });
  }

  /**
   * Create new user
   * @param userData User data
   * @returns API response
   */
  async createUser(userData: any) {
    return await test.step('Create new user', async () => {
      return await this.post(this.usersEndpoint, userData);
    });
  }

  /**
   * Update user
   * @param userId User ID
   * @param userData Updated user data
   * @returns API response
   */
  async updateUser(userId: string, userData: any) {
    return await test.step(`Update user: ${userId}`, async () => {
      return await this.put(`${this.usersEndpoint}/${userId}`, userData);
    });
  }

  /**
   * Partially update user
   * @param userId User ID
   * @param partialData Partial user data
   * @returns API response
   */
  async patchUser(userId: string, partialData: any) {
    return await test.step(`Patch user: ${userId}`, async () => {
      return await this.patch(`${this.usersEndpoint}/${userId}`, partialData);
    });
  }

  /**
   * Delete user
   * @param userId User ID
   * @returns API response
   */
  async deleteUser(userId: string) {
    return await test.step(`Delete user: ${userId}`, async () => {
      return await this.delete(`${this.usersEndpoint}/${userId}`);
    });
  }

  /**
   * Search users by query
   * @param query Search query
   * @returns API response
   */
  async searchUsers(query: string) {
    return await test.step(`Search users: ${query}`, async () => {
      return await this.get(this.usersEndpoint, {
        params: { q: query },
      });
    });
  }
}

/**
 * Export service class manager
 */
export class APIServices {
  public readonly userService: UserAPIService;

  constructor(request: APIRequestContext) {
    this.userService = new UserAPIService(request);
  }
}
