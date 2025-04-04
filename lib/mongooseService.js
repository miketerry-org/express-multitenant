// mongooseService.js:

"use strict";

// load necessary modules
const Service = require("./service");

async function createMongooseConnection(tenant) {
  return mongoose.createConnection(tenant.Config.db_url, {});
}

class mongooseService extends Service {
  constructor(tenant) {
    super.constructor(tenant, "db", createMongooseConnection);
  }
}

// export the mongoose service
module.exports = mongooseService;
