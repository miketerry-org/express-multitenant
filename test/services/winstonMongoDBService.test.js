// winstonMongoDBService.test.js

"use strict";

// load necessary packages
const { describe, it } = require("node:test");
const assert = require("assert");
const Tenant = require("../lib/tenant");
const winstonMongoDBService = require("../lib/winstonMongoDBService");
const { validConfig } = require("./data");
const WinstonMongoDBService = require("../lib/winstonMongoDBService");

const tenant = new Tenant(validConfig);

const log = new WinstonMongoDBService(tenant);
