

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn', 
  INFO: 'info',
  DEBUG: 'debug'
};

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

function shouldLog(level) {
  const levels = Object.values(LOG_LEVELS);
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  const messageLevelIndex = levels.indexOf(level);
  return messageLevelIndex <= currentLevelIndex;
}

export const logger = {
  error: (message, error = null) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      const logEntry = {
        level: LOG_LEVELS.ERROR,
        message,
        error: error?.message || error,
        timestamp: new Date().toISOString(),
        stack: error?.stack
      };
      
    }
  },
  
  warn: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      const logEntry = {
        level: LOG_LEVELS.WARN,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      // sendToLoggingService(logEntry);
    }
  },
  
  info: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      const logEntry = {
        level: LOG_LEVELS.INFO,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      // sendToLoggingService(logEntry);
    }
  },
  
  debug: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      const logEntry = {
        level: LOG_LEVELS.DEBUG,
        message,
        data,
        timestamp: new Date().toISOString()
      };
      // sendToLoggingService(logEntry);
    }
  }
}; 