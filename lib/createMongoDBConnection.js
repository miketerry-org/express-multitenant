// createMongoDBConnection.js
"use strict";

const { serverLog } = require("./serverLog");
const mongoose = require("mongoose");

async function createMongoDBConnection(config, validate) {
  // Validate config
  const errorCount = validate.errorCount;
  validate.isString("db_url", undefined, 1, 255);
  if (validate.errorCount > errorCount) {
    throw new Error(
      `Tenant ${config.tenant_id}: ${validate.errors.join("\n")}`
    );
  }

  try {
    const connection = await mongoose.createConnection(config.db_url, {});

    connection.on("connected", () => {
      serverLog.info(
        `Tenant ${config.tenant_id}: Connected to "${connection.name}"`
      );
    });

    connection.on("error", (err) => {
      serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    });

    connection.on("disconnected", () => {
      serverLog.info(
        `Tenant ${config.tenant_id}: Disconnected from "${connection.name}"`
      );
    });

    return connection;
  } catch (err) {
    serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant ${config.tenant_id}: ${err.message}`);
  }
}

module.exports = createMongoDBConnection;
