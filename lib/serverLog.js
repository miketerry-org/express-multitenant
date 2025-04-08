"use strict";

// Default to the global console object
let _serverLog = console;

function setServerLog(value) {
  // Check if value has a valid log function
  if (value && typeof value.log === "function") {
    _serverLog = value;
  } else {
    // If invalid, revert to the default console logger
    console.warn("Attempted to set an invalid logger. Using default console.");
    _serverLog = console;
  }
}

module.exports = {
  // Getter for the serverLog
  get serverLog() {
    return _serverLog;
  },

  // Setter for the serverLog
  set serverLog(value) {
    setServerLog(value);
  },
};
