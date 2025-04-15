"use strict";

// Load the server logger
const { serverLog } = require("./serverLog");

async function createWinstonMongoDBLog(config, validate) {
  // Validate configuration
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

  // Destructure values
  const {
    db_url,
    log_collection_name,
    log_expiration_days = undefined,
    log_capped = false,
    log_max_size = undefined,
    log_max_docs = undefined,
  } = config;

  try {
    // Lazy-load dependencies
    const winston = require("winston");
    require("winston-mongodb");
    const { MongoClient } = require("mongodb");

    // Connect to MongoDB
    const client = await MongoClient.connect(db_url);
    const db = client.db();

    // Check if collection exists
    const collections = await db
      .listCollections({ name: log_collection_name })
      .toArray();

    if (collections.length === 0) {
      if (log_capped && log_max_docs && log_max_size) {
        await db.createCollection(log_collection_name, {
          capped: true,
          size: log_max_size * 1024 * 1024,
          max: log_max_docs,
        });
        console.debug(
          `express-tenants: Created capped collection: ${log_collection_name} for winston logger`
        );
      } else {
        await db.createCollection(log_collection_name);
        console.debug(
          `express-tenants: Created collection: ${log_collection_name} for winston logger`
        );
      }
    } else {
      console.debug(
        `express-tenants: Collection already exists: ${log_collection_name}`
      );
    }

    // get connection to the collection
    const collection = db.collection(log_collection_name);

    // Enforce TTL indexing if enabled
    if (log_capped && log_expiration_days) {
      console.debug(
        `Tenant ${config.tenant_id}: Cannot use both capped and TTL options on the same collection.`
      );
      throw new Error(
        `Tenant ${config.tenant_id}: Cannot use both capped and TTL options on the same collection.`
      );
    }

    if (!log_capped && log_expiration_days) {
      const indexes = await collection.indexes();
      const ttlExists = indexes.some(
        (i) =>
          i.key?.timestamp === 1 &&
          i.expireAfterSeconds &&
          i.name === "timestamp_ttl"
      );

      if (!ttlExists) {
        await collection.createIndex(
          { timestamp: 1 },
          {
            expireAfterSeconds: log_expiration_days * 86400,
            name: "timestamp_ttl",
          }
        );
        console.debug(
          `Created TTL index 'timestamp_ttl' for ${log_expiration_days} days`
        );
      } else {
        console.debug("TTL index 'timestamp_ttl' already exists");
      }
    }

    // Create and return the logger
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

    // return the winston logger for this tenant
    return logger;
  } catch (err) {
    console.debug(`Tenant ${config.tenant_id}: ${err.message}`);
    serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant ${config.tenant_id}: ${err.message}`);
  }
}

module.exports = createWinstonMongoDBLog;
