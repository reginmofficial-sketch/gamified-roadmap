/**
 * Structured Logger for the application.
 * Supports levels: DEBUG, INFO, WARN, ERROR.
 */
export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    constructor(prefix = "APP") {
        this.prefix = prefix;
        this.level = LogLevel.DEBUG; // Default level
    }

    setLevel(level) {
        this.level = level;
    }

    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.prefix}] ${message}`;
    }

    debug(message, ...args) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(this.formatMessage("DEBUG", message), ...args);
        }
    }

    info(message, ...args) {
        if (this.level <= LogLevel.INFO) {
            console.info(this.formatMessage("INFO", message), ...args);
        }
    }

    warn(message, ...args) {
        if (this.level <= LogLevel.WARN) {
            console.warn(this.formatMessage("WARN", message), ...args);
        }
    }

    error(message, error = null) {
        if (this.level <= LogLevel.ERROR) {
            console.error(this.formatMessage("ERROR", message), error || "");
        }
    }
}

export const logger = new Logger("Roadmap");
