const asyncHandler = require('../../utiles/asynchandller');

describe('asyncHandler Utility', () => {
  test('should execute async function successfully', async () => {
    const req = {}, res = {}, next = jest.fn();
    const asyncFn = jest.fn().mockResolvedValue('success');

    const handler = asyncHandler(asyncFn);
    await handler(req, res, next);

    expect(asyncFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('should catch asynchronous errors and pass to next()', async () => {
    const req = {}, res = {}, next = jest.fn();
    const mockError = new Error('Async error');
    const asyncFn = jest.fn().mockRejectedValue(mockError);

    const handler = asyncHandler(asyncFn);
    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});