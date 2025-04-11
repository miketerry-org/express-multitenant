"use strict";

// Load the server logger
const { serverLog } = require("./serverLog");

// Create a Winston logger with MongoDB transport
async function createWinstonMongoDBLog(config, validate, callback) {
  console.log("A", config);

  try {
    // Validate configuration values
    const errorCount = validate.errors.length;

    validate
      .isString("db_url", undefined, 1, 255, undefined, true)
      .isString("log_collection_name", "logs", 1, 255, undefined, true)
      .isInteger("log_expiration_days", undefined, 1, 365, false)
      .isBoolean("log_capped", undefined, false)
      .isInteger("log_max_size", undefined, 1, undefined, false)
      .isInteger("log_max_docs", undefined, undefined, undefined, false);

    if (validate.errors.length > errorCount) {
      throw new Error(
        `Tenant ${config.tenant_id}: ${validate.errors.join("\n")}`
      );
    }

    // Extract values
    const {
      db_url,
      log_collection_name,
      log_expiration_days = undefined,
      log_capped = false,
      log_max_size = undefined,
      log_max_docs = undefined,
    } = config;

    // Load dependencies only when used
    const winston = require("winston");
    require("winston-mongodb");
    const { MongoClient } = require("mongodb");

    // Connect to MongoDB
    const client = await MongoClient.connect(db_url);
    const db = client.db();

    // Check if the collection exists
    const existingCollections = await db
      .listCollections({ name: log_collection_name })
      .toArray();
    const collectionExists = existingCollections.length > 0;

    let collectionObj;

    if (!collectionExists) {
      // Handle capped collection
      if (log_capped && log_max_docs && log_max_size) {
        await db.createCollection(log_collection_name, {
          capped: true,
          size: log_max_size * 1024 * 1024,
          max: log_max_docs,
        });
        console.log(`Created capped collection: ${log_collection_name}`);
      } else {
        await db.createCollection(log_collection_name);
        console.log(`Created collection: ${log_collection_name}`);
      }
    } else {
      console.log(`Collection already exists: ${log_collection_name}`);
    }

    // Get the collection object
    collectionObj = db.collection(log_collection_name);

    // Ensure no conflict between capped and TTL
    if (log_capped && log_expiration_days) {
      throw new Error(
        `Tenant ${config.tenant_id}: Cannot use both capped and TTL options for the same collection.`
      );
    }

    // Setup TTL index if applicable
    if (!log_capped && log_expiration_days) {
      const indexes = await collectionObj.indexes();
      const hasMatchingTTLIndex = indexes.some(
        (index) =>
          index.key &&
          index.key.timestamp === 1 &&
          index.expireAfterSeconds &&
          index.name === "timestamp_ttl"
      );

      if (!hasMatchingTTLIndex) {
        await collectionObj.createIndex(
          { timestamp: 1 },
          {
            expireAfterSeconds: log_expiration_days * 24 * 60 * 60,
            name: "timestamp_ttl",
          }
        );
        console.log(
          `Created TTL index 'timestamp_ttl' for ${log_expiration_days} days`
        );
      } else {
        console.log("TTL index 'timestamp_ttl' already exists");
      }
    }

    // Create the logger
    const logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new winston.transports.MongoDB({
          db: db_url,
          collection: log_collection_name,
          level: "info",
          options: {},
        }),
      ],
    });

    // Assign the logger to the tenant via callback
    callback(logger);
  } catch (err) {
    serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    console.log("here: " + err.message);
    throw new Error(`Tenant ${config.tenant_id}: ${err.message}`);
  }
}

module.exports = createWinstonMongoDBLog;
