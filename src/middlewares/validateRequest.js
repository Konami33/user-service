const { body, validationResult } = require('express-validator');
const { trace, SpanStatusCode, metrics } = require('@opentelemetry/api');
const { SemanticAttributes } = require('@opentelemetry/semantic-conventions');
const logger = require('../config/logger');


// Initialize metrics
const meter = metrics.getMeter('user-service', '0.1.0');
const validationErrorCounter = meter.createCounter('validation_errors_total', {
  description: 'Total number of validation errors',
  unit: 'errors',
});


// exports an array of middlewares. name checking, email checking, and then the validation function.
const validateRequest = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {

    //getting the active span from tracing middleware
    const span = trace.getActiveSpan();

    try {

      // set the attribute for the span
      if(span) {
        span.setAttribute('app.validation.path', req.originalUrl);
      }

      // validate the request.
      const errors = validationResult(req);

      // error occured
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        if (span) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: `Validation failed: ${errorMessages}`,
          });
          span.setAttribute('app.validation.errors', errorMessages);
        }

        logger.error('Request validation failed', {
          errors: errorMessages,
          httpUrl: req.originalUrl,
          httpMethod: req.method,
        });

        validationErrorCounter.add(1, {
          'validation.errors': errorMessages,
        });

        res.status(400).json({ errors: errors.array() });
        return;
      }

      // no error
      logger.info('Request validation succeeded', {
        httpUrl: req.originalUrl,
        httpMethod: req.method,
      });

      if (span) {
        span.addEvent('Validation succeeded');
      }

      next()
    } catch (error) {
      logger.error('Error during validation', {
        errorMessage: error.message,
        httpUrl: req.originalUrl,
        httpMethod: req.method,
      });

      if (span) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        span.recordException(error);
      }
      validationErrorCounter.add(1, { 'error.type': error.name || 'UnknownError' });
      next(error);
    }
  },
];

module.exports = validateRequest;