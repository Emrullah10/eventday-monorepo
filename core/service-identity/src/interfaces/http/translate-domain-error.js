import { AppError } from '@everyday/errors';

/**
 * Wraps a use-case so its domain errors reach Express as the right HTTP
 * status/body, without the use-case itself knowing about HTTP. Non-AppError
 * failures are rethrown so the shared `handleErrors` middleware logs them as
 * unexpected bugs.
 */
export const wrapWithHttpTranslation = (useCase) => async (...args) => {
  try {
    return await useCase(...args);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};
