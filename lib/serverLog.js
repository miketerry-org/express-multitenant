// serverLog.js:

"use strict";

// Default logger is the global console object
let _serverLog = console;

/**
 * Validates that a logger object implements required log methods
 */
function isValidLogger(value) {
  const requiredMethods = ["log", "info", "warn", "error"];
  return (
    value &&
    typeof value === "object" &&
    requiredMethods.every((method) => typeof value[method] === "function")
  );
}

/**
 * Sets the global logger to a custom implementation.
 * This should only be called once, typically at app startup.
 */
function setServerLog(value) {
  if (isValidLogger(value)) {
    _serverLog = value;
  } else {
    console.debug(
      "[serverLog] Invalid logger provided. Falling back to console."
    );
    _serverLog = console;
  }
}

// Export the logger accessor and setter
module.exports = {
  // Use as a read-only accessor in other modules
  get serverLog() {
    return _serverLog;
  },

  // Use to set the logger once during startup
  setServerLog,
};
