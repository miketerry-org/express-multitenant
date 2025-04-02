// tenants.js:

"use strict";

// Load all necessary packages
const Confirm = require("confirm-json");
const TopSecret = require("topsecret");
const Tenant = require("./tenant");

class Tenants {
  // Private values
  #tenantClass = Tenant;
  #list; // List of tenant objects
  #topsecret; // TopSecret instance for encryption and decryption

  constructor(tenantClass = Tenant) {
    this.#tenantClass = tenantClass;
    this.#list = [];
    this.#topsecret = new TopSecret();

    // Bind `this` to the `middleware` method to ensure the correct context
    this.middleware = this.middleware.bind(this);
  }

  add(tenantConfig) {
    // ensure the tenantConfig parameter is an object
    if (!tenantConfig || typeof tenantConfig !== "object") {
      throw new Error(`The "tenantConfig" parameter must be a valid object`);
    }

    // Create a new Tenant object with the provided configuration
    const tenant = new this.#tenantClass(tenantConfig);

    // If no errors, add to the list
    if (tenant.errors.length === 0) {
      this.#list.push(tenant);
    } else {
      throw new Error(`Invalid Tenant: ${tenant.errors.join(",")}`);
    }

    // return the new tenant
    return tenant;
  }

  addList(tenantConfigList) {
    tenantConfigList.forEach((tenantConfig) => {
      this.add(tenantConfig);
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
      return item.domain.toLowerCase() === hostname.toLowerCase();
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
      // assign tenant instance to request
      req.tenant = tenant;

      // assign database to request, this will trigger connect to database if not already connected
      req.db = tenant.db;

      // combine all tenant site properties with existing response locals
      res.locals = { ...res.locals, ...tenant.site };

      // call the next middleware in the chain
      next();
    } catch (err) {
      // log and send error message if database connection fails
      tenant.log.error(`Database connection failed: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
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
