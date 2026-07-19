import 'dotenv/config';

/**
 * Reads required/optional env vars for a service in one place, failing fast
 * with a clear message instead of letting `undefined` leak into the app.
 *
 * @param {Object<string, { required?: boolean, default?: string }>} schema
 */
export const loadConfig = (schema) => {
  const config = {};
  const missing = [];

  for (const [key, rule] of Object.entries(schema)) {
    const value = process.env[key] ?? rule.default;
    if (value === undefined) {
      if (rule.required) missing.push(key);
      continue;
    }
    config[key] = value;
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return config;
};
