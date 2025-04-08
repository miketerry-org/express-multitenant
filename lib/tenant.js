"use strict";

// Load all necessary modules
const Confirm = require("confirm-json");

class Tenant {
  #config = undefined;
  #db = undefined;
  #log = undefined;
  #mailer = undefined;
  #site = undefined;
  #validate = undefined;
  #services = {};

  constructor(config) {
    // Keep a reference to the configuration object
    this.#config = config;

    // Initialize the validator instance
    this.#validate = new Confirm(this.#config);

    // Call the method to validate the configuration object
    this.validateConfig();
  }

  /**
   * Adds a service to the Tenant.
   * @param {string} name - The name of the service.
   * @param {Function} createServiceFunc - A function that creates the service.
   */
  addService(name, createServiceFunc) {
    // Validate createServiceFunc is a function
    if (typeof createServiceFunc !== "function") {
      throw new Error(
        `createServiceFunc must be a function for service: ${name}`
      );
    }

    try {
      // Call createServiceFunc to create the service and assign it
      createServiceFunc(this.#config, this.#validate, (value) => {
        // Ensure valid service value before assigning
        if (value != null) {
          this.#services[name] = value;
        } else {
          throw new Error(
            `Invalid value returned by createServiceFunc for service: ${name}`
          );
        }
      });
    } catch (err) {
      // Throw a more descriptive error if service creation fails
      throw new Error(`Error while adding service "${name}": ${err.message}`);
    }
  }

  /**
   * Returns the configuration object.
   * @returns {Object} The configuration object.
   */
  get config() {
    return this.#config;
  }

  /**
   * Returns the validation errors.
   * @returns {Array} Validation errors.
   */
  get errors() {
    return this.#validate.errors;
  }

  /**
   * Returns the site-related properties from the configuration.
   * Caches the values once they are accessed for better performance.
   * @returns {Object} The site-related configuration properties.
   */
  get site() {
    // Early exit if already cached
    if (this.#site) {
      return this.#site;
    }

    // Initialize site properties only if necessary
    this.#site = Object.entries(this.#config)
      .filter(([key]) => key.startsWith("site_"))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return this.#site;
  }

  /**
   * Returns the validation instance.
   * @returns {Confirm} The validation instance.
   */
  get validate() {
    return this.#validate;
  }

  validateConfig() {
    this.#validate
      .isInteger("tenant_id", undefined, 1, 100000)
      .isInteger("node_id", undefined, 1, 1000)
      .isString("domain", undefined, 1, 255)
      .isString("site_title", undefined, 1, 255)
      .isString("site_slogan", undefined, 1, 255)
      .isString("site_owner", undefined, 1, 255)
      .isInteger("site_copyright", undefined, 1980, 9999)
      .isArray("site_roles")
      .isString("site_support_email", undefined, 1, 255)
      .isString("site_support_url", undefined, 1, 255);
  }
}

module.exports = Tenant;
