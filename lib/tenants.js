// tenants.js:

"use strict";

// Load all necessary packages
const Confirm = require("confirm-json");
const TopSecret = require("topsecret");
const Tenant = require("./tenant");

class Tenants {
  // Private values
  #tenantClass = Tenant;
  #list = []; // List of tenant objects
  #topsecret; // TopSecret instance for encryption and decryption

  constructor(tenantClass = Tenant) {
    this.#tenantClass = tenantClass;
    this.#list = [];
    this.#topsecret = new TopSecret();
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
    console.log("tenantsConfigList", tenantConfigList);
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
  find(domain) {
    return this.#list.find((item) => {
      return item.domain.toLowerCase() === domain.toLowerCase();
    });
  }

  /**
   * Loads tenant data from an encrypted file.
   *
   * @param {string} filename - The filename of the encrypted tenant data file.
   */
  loadFromFile(filename) {
    this.addList(this.#topsecret.decryptJSONFromFile(filename));
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
