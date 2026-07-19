const LEVELS = ['debug', 'info', 'warn', 'error'];

const write = (level, serviceName, message, meta) => {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${serviceName}] ${message}`;
  const args = meta !== undefined ? [line, meta] : [line];
  if (level === 'error') console.error(...args);
  else if (level === 'warn') console.warn(...args);
  else console.log(...args);
};

/** Small leveled logger, namespaced per service so multi-service logs stay readable. */
export const makeLogger = (serviceName) => {
  const logger = {};
  for (const level of LEVELS) {
    logger[level] = (message, meta) => write(level, serviceName, message, meta);
  }
  return logger;
};
