import { AppError } from '@everyday/errors';

export const wrapWithHttpTranslation = (useCase) => async (...args) => {
  try {
    return await useCase(...args);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw error;
  }
};
