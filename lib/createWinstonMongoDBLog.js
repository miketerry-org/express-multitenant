// create/winstonMongoDBLog.js:

"use strict";

// load the serverLog
const { serverLog } = require("./serverLog");

// use the tenant.config to create a winston/mongoDB logger
async function createWinstonMongoDBLog(config, validate, callback) {
  try {
    // Validate the configuration properties
    let errorCount = validate.errors.length;
    validate
      .isString("log_db_url", undefined, 1, 255, true)
      .isString("log_collection_name", "logs", 1, 255, true)
      .isInteger("log_expiration_days", undefined, 1, 365, false)
      .isBoolean("log_capped", undefined, false)
      .isInteger("log_max_size", undefined, 1, undefined, false) // Max size for capped collections
      .isInteger("log_max_docs", undefined, undefined, undefined, false); // Max docs for capped collections
    if (validate.errors.length > errorCount) {
      throw new Error(
        `Tenant ${config.tenant_id}: ${validate.errors.join("\n")}`
      );
    }

    // Destructure configuration values from the tenant config
    const {
      log_db_url,
      log_collection_name,
      log_expiration_days = undefined,
      log_capped = false,
      log_max_size = undefined,
      log_max_docs = undefined,
    } = config;

    // only load the winston modules if this function is called
    const winston = require("winston");
    require("winston-mongodb"); // This is necessary to use the MongoDB transport

    // Create MongoDB client
    const MongoClient = require("mongodb").MongoClient;
    const client = await MongoClient.connect(log_db_url);
    const db = client.db();

    // create the collection for logging
    const collectionObj = db.collection(log_collection_name);

    // Check for conflicting options: cannot use both capped and TTL options
    if (log_capped && log_expiration_days) {
      throw new Error(
        `Tenant ${config.tenant_id}: Cannot use both capped and TTL options for the same collection.`
      );
    }

    // If capped collection properties are specified
    if (log_capped && log_max_docs && log_max_size) {
      // Create a capped collection if the properties are provided
      await db.createCollection(log_collection_name, {
        log_capped: true,
        size: log_max_size * 1024 * 1024, // Max size converted from MB to bytes
        max: log_max_docs, // Limit to a maximum number of documents
      });
    }
    // If no capped collection config, check for TTL index
    else if (log_expiration_days) {
      // Create a TTL index on the specified field (default is 'timestamp')
      await collectionObj.createIndex(
        { timestamp: 1 }, // Create index on 'timestamp' field
        { expireAfterSeconds: log_expiration_days * 24 * 60 * 60 } // Expire documents after specified days
      );
    }
    // If neither capped nor TTL config is provided, just create a standard collection
    else {
      await db.createCollection(log_collection_name);
    }

    // Create the logger instance
    const logger = winston.createLogger({
      level: "info", // Set default logging level
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        // Console transport for logging to the console
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        // MongoDB transport to log to MongoDB
        new winston.transports.MongoDB({
          db: log_db_url,
          collection: log_collection_name,
          level: "info", // Minimum level to log into MongoDB (can be adjusted)
          options: {},
        }),
      ],
    });

    // use callback to assign logger to tenant instance
    callback(logger);
  } catch (err) {
    serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant ${config.tenant_id}: ${err.message}`);
  }
}

// export the function to create the winston MongoDB logger
module.exports = createWinstonMongoDBLog;
