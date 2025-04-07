// index.js:

"use strict";

// load all necessary modules
const Tenant = require("./lib/tenant");
const Tenants = require("./lib/tenants");
const { setServerLog } = require("./lib/serverLog");
const createMongoDBConnection = require("./lib/createMongoDBConnection");
const createNodeMailer = require("./lib/createNodeMailer");
const createWinstonMongoDBLog = require("./lib/createWinstonMongoDBLog");

module.exports = {
  Tenant,
  Tenants,
  setServerLog,
  createMongoDBConnection,
  createNodeMailer,
  createWinstonMongoDBLog,
};
