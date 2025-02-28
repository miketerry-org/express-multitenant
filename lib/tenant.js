// tenant.js:

"use strict";

class Tenant {
  // private variables copied from config object passed to constructor
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
   * @param {Object} config.dbConfig database configuration.
   * @param {Object} config.smtpConfig SMTP configuration.
   */
  constructor(config) {
    this.#tenant_id = config.tenant_id;
    this.#node_id = config.node_id;
    this.#hostname = config.hostname;
    this.#locals = { ...config.locals };
    this.#dbConfig = { ...config.dbConfig };
    this.#smtpConfig = { ...config.smtpConfig };
    this.#dbConnectFunc = null;
  }

  get tenant_id() {
    return this.#tenant_id;
  }

  get node_id() {
    return this.#node_id;
  }

  get hostname() {
    return this.#hostname;
  }

  get locals() {
    return this.#locals;
  }

  get dbConfig() {
    return this.#dbConfig;
  }

  get smtpConfig() {
    return this.#smtpConfig;
  }

  connect() {
    if (this.#db === null) {
      if (this.#dbConnectFunc) {
        this.#db = this.#dbConnectFunc(this.#dbConfig);
      } else {
        throw new Error(`Database connect function is not assigned.`);
      }
    }

    // return the database connection
    return this.#db;
  }

  disconnect() {
    this.#db = null;
  }

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

  get dbConnectFunc() {
    return this.#dbConnectFunc;
  }

  set dbConnectFunc(value) {
    if (value && typeof value === "function") {
      this.#dbConnectFunc = value;
    } else {
      throw new Error(
        `"dbConnectFunction must be a function with one "Config" parameter`
      );
    }
  }
}

module.exports = Tenant;
