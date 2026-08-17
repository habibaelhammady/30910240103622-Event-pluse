const AppError = require('../../utiles/AppError');

describe('AppError Utility', () => {
  test('should create an operational error with status code and message', () => {
    const error = new AppError('Resource not found', 404);

    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });
});