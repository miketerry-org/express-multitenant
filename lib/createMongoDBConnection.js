// createMongoDBConnection.js:

"use strict";

// load the server log
const { serverLog } = require("./serverLog");

// function to connect to a mongoDB database
async function createMongoDBConnection(config, validate, callback) {
  try {
    // validate mongoDB database configuration values
    const errorCount = validate.errorCount;
    validate.isString("db_url", undefined, 1, 255);
    if (validate.errorCount > errorCount) {
      throw new Error(
        `Tenant ${config.tenant_id}: ${validate.errors.join("\n")}`
      );
    }

    //  only load mongoose module if this function is called
    const mongoose = require("mongoose");

    // create connection to specified mongodb database
    const connection = await mongoose.createConnection(config.db_url, {});

    // assign connection events
    connection.on("connected", () => {
      serverLog.info(
        `Tenant ${config.tenant_id}: Connected To "${connection.name}`
      );
    });

    connection.on("error", (err) => {
      serverLog.error(`Tenant: ${config.tenant_id}: ${err.message}`);
    });

    connection.on("disconnected", () => {
      serverLog.info(
        `Tenant ${config.tenant_id}: Disconnected from "${connection.name}`
      );
    });

    // use the callback to assign the database connection to the "tenant.services" property
    callback(connection);
  } catch (err) {
    // send error to server log and then re-throw it
    serverLog.error(`Tenant: ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant: ${config.tenant_id}: ${err.message}`);
  }
}

// export the function to create a mongodb database connection
module.exports = createMongoDBConnection;
