const userService = require('../services/userService');
const logger = require('../config/logger');

class UserController {
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      logger.info(`User created: ${user.id}`);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error creating user:', error);
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await userService.getUser(req.params.id);
      logger.info(`User retrieved: ${req.params.id}`);
      res.json(user);
    } catch (error) {
      logger.error('Error getting user:', error);
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      logger.info(`User updated: ${req.params.id}`);
      res.json(user);
    } catch (error) {
      logger.error('Error updating user:', error);
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      logger.info(`User deleted: ${req.params.id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting user:', error);
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      logger.info('Retrieved all users');
      res.json(users);
    } catch (error) {
      logger.error('Error getting all users:', error);
      next(error);
    }
  }
}

module.exports = new UserController();