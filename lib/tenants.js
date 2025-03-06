"use strict";

// Load all necessary packages
const Tenant = require("./tenant");
const TenantRule = require("./tenantRule");
const TopSecret = require("topsecret");

/**
 * Class representing a collection of tenants.
 * Provides methods to manage tenants, load/save tenant data, and ensure tenant-specific database connections.
 */
class Tenants {
  // Private values
  #list; // List of tenant objects
  #topsecret; // TopSecret instance for encryption and decryption
  #rule; // Validation rule for tenants

  /**
   * Creates an instance of Tenants.
   * Initializes an empty list of tenants, a TopSecret instance, the database connect function, and an optional custom validation rule.
   *
   * @param {TenantRule} [rule=undefined] - An optional custom rule for validating tenant data. If not provided, the default TenantRule is used.
   * @throws {Error} If the dbConnectFunc is not a valid function.
   */
  constructor(rule = undefined) {
    this.#list = [];
    this.#topsecret = new TopSecret();
    this.#rule = rule || new TenantRule();

    // Bind `this` to the `middleware` method to ensure the correct context
    this.middleware = this.middleware.bind(this);
  }

  /**
   * Adds a new tenant to the list after validation.
   *
   * @param {Object} data - The tenant data to be added. The object should contain all necessary tenant details.
   * @throws {Error} If the data is not a valid object or tenant definition according to the validation rule.
   * @returns {Tenant} A new tenant class instance.
   */
  add(data) {
    if (!data || typeof data !== "object") {
      throw new Error(`The "data" parameter must be a valid object`);
    }

    // Verify the tenant JSON data object is valid using the rule
    this.#rule.check(data);

    // Create a new Tenant object with the provided data
    const tenant = new Tenant(data);

    // If no error, add to the list
    this.#list.push(tenant);

    // return the new tenant
    return tenant;
  }

  /**
   * Adds a list of tenants to the collection.
   *
   * @param {Array<Object>} dataList - The list of tenant data objects to be added.
   */
  addList(dataList) {
    dataList.forEach((data) => {
      this.add(data);
    });
  }

  /**
   * Finds a tenant by its hostname.
   *
   * @param {string} hostname - The hostname of the tenant to find.
   * @returns {Tenant|undefined} The tenant object if found, or undefined if no match is found.
   */
  find(hostname) {
    return this.#list.find((item) => {
      return item.hostname.toLowerCase() === hostname.toLowerCase();
    });
  }

  /**
   * Loads tenant data from an encrypted file.
   *
   * @param {string} filename - The filename of the encrypted tenant data file.
   */
  loadFromFile(filename) {
    this.#list = this.#topsecret.decryptJSONFromFile(filename);
  }

  /**
   * Saves tenant data to an encrypted file.
   *
   * @param {string} filename - The filename where tenant data will be saved.
   */
  saveToFile(filename) {
    this.#topsecret.encryptJSONToFile(filename, this.#list); // Ensure list is passed to the encryption method
  }

  /**
   * Middleware to ensure tenant-specific database connection is available.
   * This middleware is typically used in a web server context to associate a tenant with a request.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @throws {Error} If a tenant cannot be found, or if database connection fails.
   */
  middleware(req, res, next) {
    // use the request hostname to find the correct tenant
    let tenant = this.find(req.hostname);

    // return 404 error if tenant is not found
    if (!tenant) {
      return res.status(404).send("Tenant not found");
    }

    try {
      // assign tenant class to request
      req.tenant = tenant;

      // assign database to request, this will trigger connect to database if not already connected
      req.db = tenant.db;

      // combine any tenant locals with existing response locals
      res.locals = { ...res.locals, ...tenant.locals };

      // call the next middleware in the chain
      next();
    } catch (err) {
      // send error message if database connection fails
      res.status(500).send(`Database connection failed: ${err.message}`);
    }
  }

  /**
   * Sets the database connection function for all tenants.
   *
   * @param {Function} value - The function that handles database connection for tenants.
   */
  set dbConnectFunc(value) {
    if (typeof value !== "function") {
      throw new Error("dbConnectFunc must be a function");
    }
    this.#list.forEach((tenant) => {
      tenant.dbConnectFunc = value;
    });
  }

  /**
   * Gets the number of tenants in the list.
   *
   * @returns {number} The length of the tenant list.
   */
  get length() {
    return this.#list.length;
  }

  /**
   * Gets the list of tenants.
   *
   * @returns {Array<Tenant>} The list of tenant instances.
   */
  get list() {
    return this.#list;
  }

  /**
   * Gets the encryption key used by TopSecret.
   *
   * @returns {string} The encryption key.
   */
  get key() {
    return this.#topsecret.key;
  }

  /**
   * Sets the encryption key used by TopSecret.
   *
   * @param {string} value - The new encryption key.
   */
  set key(value) {
    this.#topsecret.key = value;
  }

  /**
   * Gets the password used by TopSecret.
   *
   * @returns {string} The password.
   */
  get password() {
    return this.#topsecret.password;
  }

  /**
   * Sets the password used by TopSecret.
   *
   * @param {string} value - The new password.
   */
  set password(value) {
    this.#topsecret.password = value;
  }
}

// Export the Tenants class module
module.exports = Tenants;
