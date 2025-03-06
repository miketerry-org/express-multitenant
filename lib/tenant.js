// tenants.js:

// "use strict";

/**
 * Represents a Tenant with configuration details, including database and SMTP configurations.
 * @class
 */
class Tenant {
  // Private variables copied from config object passed to constructor
  #db = null;
  #tenant_id = null;
  #node_id = null;
  #hostname = null;
  #locals = null;
  #dbConfig = null;
  #smtpConfig = null;
  #dbConnectFunc = null;

  /**
   * Constructor to initialize a new Tenant object with the given config.
   * @param {Object} config Configuration object for the tenant.
   * @param {string} config.tenant_id Tenant ID.
   * @param {string} config.node_id Node ID.
   * @param {string} config.hostname Hostname of the tenant.
   * @param {Object} config.locals Local settings for the tenant.
   * @param {Object} config.dbConfig Database configuration.
   * @param {Object} config.smtpConfig SMTP configuration.
   * @throws {Error} Throws an error if any required property is missing from the config.
   */
  constructor(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Config object must be provided.");
    }
    this.#tenant_id = config.tenant_id || null;
    this.#node_id = config.node_id || null;
    this.#hostname = config.hostname || null;
    this.#locals = { ...config.locals };
    this.#dbConfig = { ...config.dbConfig };
    this.#smtpConfig = { ...config.smtpConfig };

    if (!this.#tenant_id || !this.#node_id || !this.#hostname) {
      throw new Error(
        "Missing required properties: tenant_id, node_id, or hostname."
      );
    }

    this.#dbConnectFunc = null;
  }

  /**
   * Gets the tenant ID.
   * @returns {string|null} The tenant ID.
   */
  get tenant_id() {
    return this.#tenant_id;
  }

  /**
   * Gets the node ID.
   * @returns {string|null} The node ID.
   */
  get node_id() {
    return this.#node_id;
  }

  /**
   * Gets the hostname of the tenant.
   * @returns {string|null} The hostname of the tenant.
   */
  get hostname() {
    return this.#hostname;
  }

  /**
   * Gets the local settings for the tenant.
   * @returns {Object} The local settings for the tenant.
   */
  get locals() {
    return this.#locals;
  }

  /**
   * Gets the database configuration for the tenant.
   * @returns {Object} The database configuration object.
   */
  get dbConfig() {
    return this.#dbConfig;
  }

  /**
   * Gets the SMTP configuration for the tenant.
   * @returns {Object} The SMTP configuration object.
   */
  get smtpConfig() {
    return this.#smtpConfig;
  }

  /**
   * Establishes a connection to the database using the provided dbConnectFunc.
   * If a connection already exists, it will return the existing connection.
   * @returns {Object} The database connection.
   * @throws {Error} If the database connection function is not assigned.
   */
  connect() {
    if (this.#db === null) {
      if (this.#dbConnectFunc) {
        this.#db = this.#dbConnectFunc(this.#dbConfig);
      } else {
        throw new Error("Database connect function is not assigned.");
      }
    }

    // Return the database connection
    return this.#db;
  }

  /**
   * Disconnects from the database by setting the connection to null.
   */
  disconnect() {
    this.#db = null;
  }

  /**
   * Checks if the tenant is connected to the database.
   * @returns {boolean} Returns true if connected to the database, otherwise false.
   */
  get connected() {
    return this.#db !== null;
  }

  /**
   * Getter for the database connection.
   * If the database connection has not been established yet,
   * it will attempt to connect using the provided connection function.
   * The connection is then cached in the #db private field for future use.
   * @returns {Object} The database connection.
   */
  get db() {
    this.connect();
    return this.#db;
  }

  /**
   * Gets the current database connection function.
   * @returns {Function|null} The database connection function or null if not set.
   */
  get dbConnectFunc() {
    return this.#dbConnectFunc;
  }

  /**
   * Sets the database connection function.
   * The function must accept a configuration object as its only parameter.
   * @param {Function} value The database connection function.
   * @throws {Error} Throws an error if the provided value is not a function.
   */
  set dbConnectFunc(value) {
    if (value && typeof value === "function") {
      this.#dbConnectFunc = value;
    } else {
      throw new Error(
        '"dbConnectFunc" must be a function that accepts a config parameter.'
      );
    }
  }
}

module.exports = Tenant;
