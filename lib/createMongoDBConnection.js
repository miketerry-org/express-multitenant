// createMongoDBConnection.js:

"use strict";

// load the server log
const { serverLog } = require("./serverLog");

// function to connect to a mongoDB database
async function createMongoDBConnection(tenant) {
  try {
    // validate mongoDB database configuration values
    const errorCount = tenant.validate.errorCount;
    tenant.validate.isString("db_url", undefined, 1, 255);
    if (tenant.validate.errorCount > errorCount) {
      throw new Error(tenant.validate.errors.join("\n"));
    }

    //  only load mongoose module if this function is called
    const mongoose = require("mongoose");

    // create connection to specified mongodb database
    const connection = await mongoose.createConnection(
      tenant.config.db_url,
      {}
    );

    // assign connection events
    connection.on("connected", () => {
      serverLog.info(`Connected To "${connection.name}`);
    });

    connection.on("error", (err) => {
      serverLog.error(`Error connecting to "${connection.name}"`, err);
    });

    connection.on("disconnected", () => {
      serverLog.info(`Disconnected from "${connection.name}`);
    });

    // return the mongoDB database connection
    return connection;
  } catch (err) {
    // display any error to console and then re-throw it
    serverLog.error(err.message);
    throw new Error(err.message);
  }
}

// export the function to create a mongodb database connection
module.exports = createMongoDBConnection;
