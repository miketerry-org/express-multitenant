// serverLog.js:

"use strict";

let _serverLog = console;

// function to re-assign server log from console to another logging object
function setServerLog(value) {
  _serverLog = value;
}

// export the global server log
module.exports = { _serverLog, setServerLog };
