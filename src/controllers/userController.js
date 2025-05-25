const { trace, SpanStatusCode } = require('@opentelemetry/api');
const userService = require('../services/userService');
const logger = require('../config/logger');

class UserController {
  async createUser(req, res, next) {
    const tracer = trace.getTracer('user-service');
    return tracer.startActiveSpan('createUser', async (span) => {
      try {
        span.setAttribute('http.method', 'POST');
        span.setAttribute('http.route', '/api/users');
        const user = await userService.createUser(req.body);
        logger.info(`User created: ${user.id}`);
        res.status(201).json(user);
      } catch (error) {
        logger.error('Error creating user:', error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        next(error);
      } finally {
        span.end();
      }
    });
  }

  async getUser(req, res, next) {
    const tracer = trace.getTracer('user-service');
    return tracer.startActiveSpan('getUser', async (span) => {
      try {
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/api/users/:id');
        span.setAttribute('user.id', req.params.id);
        const user = await userService.getUser(req.params.id);
        logger.info(`User retrieved: ${req.params.id}`);
        res.json(user);
      } catch (error) {
        logger.error('Error getting user:', error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        next(error);
      } finally {
        span.end();
      }
    });
  }

  async updateUser(req, res, next) {
    const tracer = trace.getTracer('user-service');
    return tracer.startActiveSpan('updateUser', async (span) => {
      try {
        span.setAttribute('http.method', 'PUT');
        span.setAttribute('http.route', '/api/users/:id');
        span.setAttribute('user.id', req.params.id);
        const user = await userService.updateUser(req.params.id, req.body);
        logger.info(`User updated: ${req.params.id}`);
        res.json(user);
      } catch (error) {
        logger.error('Error updating user:', error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        next(error);
      } finally {
        span.end();
      }
    });
  }

  async deleteUser(req, res, next) {
    const tracer = trace.getTracer('user-service');
    return tracer.startActiveSpan('deleteUser', async (span) => {
      try {
        span.setAttribute('http.method', 'DELETE');
        span.setAttribute('http.route', '/api/users/:id');
        span.setAttribute('user.id', req.params.id);
        await userService.deleteUser(req.params.id);
        logger.info(`User deleted: ${req.params.id}`);
        res.status(204).send();
      } catch (error) {
        logger.error('Error deleting user:', error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        next(error);
      } finally {
        span.end();
      }
    });
  }

  async getAllUsers(req, res, next) {
    const tracer = trace.getTracer('user-service');
    return tracer.startActiveSpan('getAllUsers', async (span) => {
      try {
        span.setAttribute('http.method', 'GET');
        span.setAttribute('http.route', '/api/users');
        const users = await userService.getAllUsers();
        logger.info('Retrieved all users');
        res.json(users);
      } catch (error) {
        logger.error('Error getting all users:', error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        next(error);
      } finally {
        span.end();
      }
    });
  }
}

module.exports = new UserController();

