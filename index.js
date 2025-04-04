// index.js:

"use strict";

// load all necessary modules
const Service = require("./lib/service");
const Tenant = require("./lib/tenant");
const Tenants = require("./lib/tenants");
const NodemailerService = require("./lib/nodemailerService");

// export the tenant, tenants and nodemailer classes
module.exports = { Tenant, Tenants, Service, NodemailerService };
