// winstonMongoDBService.js:

"use strict";

// load all necessary packages
const Service = require("./service");

// use the tenant.config to create a winston/mongodb logger
async function createWinstonMongoDBLog(tenant) {
  // lazy load the necessary winston modules
  const winston = require("winston");
  require("winston-mongodb"); // This is necessary to use the MongoDB transport

  // Validate the configuration properties
  let errorCount = tenant.errors.length;
  tenant.validate
    .isString("log_db_url", undefined, 1, 255, true)
    .isString("log_collection_name", "logs", 1, 255, true)
    .isInteger("log_expiration_days", undefined, 1, 365, false)
    .isBoolean("log_capped", undefined, false)
    .isInteger("log_max_size", undefined, 1, undefined, false) // Max size for capped collections
    .isInteger("log_max_docs", undefined, undefined, undefined, false); // Max docs for capped collections

  // If any new errors then throw exception
  if (tenant.validate.errors.length > errorCount) {
    throw new Error(tenant.validate.errors.join("\n"));
  }

  // Destructure configuration values from the tenant config
  const {
    log_db_url,
    log_collection_name,
    log_experation_days = undefined,
    log_capped = false,
    log_max_size = undefined,
    log_max_docs = undefined,
  } = tenant.config;

  // Create MongoDB client
  const MongoClient = require("mongodb").MongoClient;
  const client = await MongoClient.connect(log_db_url);
  const db = client.db();

  const collectionObj = db.collection(log_collection_name);

  // Check for conflicting options: cannot use both capped and TTL options
  if (log_capped && log_experation_days) {
    throw new Error(
      "Cannot use both capped and TTL options for the same collection."
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
  else if (log_experation_days) {
    // Create a TTL index on the specified field (default is 'timestamp')
    await collectionObj.createIndex(
      { timestamp: 1 }, // Create index on 'timestamp' field
      { expireAfterSeconds: log_experation_days * 24 * 60 * 60 } // Expire documents after specified days
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

  return logger;
}

class winstonMongoDBService extends Service {
  constructor(tenant) {
    super.constructor(tenant, "log", createWinstonMongoDBLog);
  }
}

// exports the winston mongodb service
module.exports = winstonMongoDBService;
