// index.js:

"use strict";

// load all necessary modules
const Tenant = require("./lib/tenant");
const Tenants = require("./lib/tenants");
const Service = require("./lib/service");
const mongooseService = require("./lib/mongooseService");
const NodemailerService = require("./lib/nodemailerService");
const winstonMongoDBService = require("./lib/winstonMongoDBService");

// export the tenant, tenants and pre-defined service classes
module.exports = {
  Tenant,
  Tenants,
  Service,
  mongooseService,
  NodemailerService,
  winstonMongoDBService,
};
