// index.js:

"use strict";

// Load required modules
const fs = require("fs");
const crypto = require("crypto");

/**
 * Decrypts data using AES-256-CBC encryption.
 *
 * @param {string} encryptedData - The encrypted data to be decrypted.
 * @param {string} key - The key used for decryption. Must be 32 bytes long.
 * @returns {string} - The decrypted data as a string.
 */
function decryptAES256(encryptedData, key) {
  // Convert the key to a 32-byte buffer for AES-256 (256 bits)
  const keyBuffer = Buffer.from(key, "utf8");

  // For AES-256, the IV (Initialization Vector) should be 16 bytes long
  const iv = Buffer.alloc(16, 0); // assuming the IV is all zeros (or you can use a predefined IV)

  // Create the decipher
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "utf8", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Encrypts data using AES-256-CBC encryption.
 *
 * @param {string} data - The data to be encrypted.
 * @param {string} key - The key used for encryption. Must be 32 bytes long.
 * @returns {string} - The encrypted data, encoded in base64.
 */
function encryptAES256(data, key) {
  // Convert the key to a 32-byte buffer for AES-256 (256 bits)
  const keyBuffer = Buffer.from(key, "utf8");

  // For AES-256, the IV (Initialization Vector) should be 16 bytes long
  const iv = Buffer.alloc(16, 0); // assuming the IV is all zeros (or you can use a predefined IV)

  // Create the cipher
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

  // Encrypt the data
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
}

/**
 * A class to manage tenant configurations.
 */
class Tenants {
  // initialize private variables
  #connectDBFunc = undefined;
  #list = [];

  set connectDBFunc(value) {
    // Ensure the parameter is provided, is a function, and accepts exactly one parameter
    if (typeof value !== "function") {
      throw new Error(
        'The "connectDBFunc" property must be assigned a function.'
      );
    }

    // Check if the function accepts exactly one parameter
    if (value.length !== 1) {
      throw new Error(
        'The "connectDBFunc" property must be assigned a function that accepts exactly one "config" object parameter.'
      );
    }

    // keep track of the connectDB function
    this.#connectDBFunc = value;
  }

  /**
   * Adds a new tenant configuration.
   *
   * @param {Object} config - The tenant configuration object.
   * @throws {Error} Throws an error if the configuration is invalid.
   */
  add(config) {
    // ensure host property exists in config object
    if (!config || !config.host) {
      throw new Error(`Tenant configuration must contain "host" property`);
    }

    // convert host to lower case
    config.host = config.host.toLowerCase();

    // ensure host property is not a duplicate
    if (this.find(config.host)) {
      throw new Error(`Tenant with "${config.host}" property already exists!`);
    }

    // ensure config does not have a "db" property
    if (config.db) {
      throw new Error(`Tenant configuration must not contain "db" property`);
    }

    // push the tenant config to the array
    this.#list.push(config);
  }

  /**
   * Finds a tenant configuration by its host.
   *
   * @param {string} host - The host to search for.
   * @returns {Object|null} - The tenant configuration if found, otherwise null.
   */
  find(host) {
    host = host.toLowerCase();
    return this.#list.find((item) => {
      return item.host === host;
    });
  }

  /**
   * Loads tenant configurations from a file, optionally decrypting it if a key is provided.
   *
   * @param {string} filename - The name of the file to read from.
   * @param {string} [encryptKey=""] - The encryption key to decrypt the content (optional).
   * @returns {Array} - The list of tenant configurations.
   * @throws {Error} Throws an error if file reading or decryption fails.
   */
  loadFromFile(filename, encryptKey = "") {
    try {
      // Read the file synchronously
      const fileContent = fs.readFileSync(filename, "utf8");

      // If an encryption key is provided, decrypt the content
      const contentToParse = encryptKey
        ? decryptAES256(fileContent, encryptKey)
        : fileContent;

      // Parse the content (decrypted or plain) as JSON
      let list = JSON.parse(contentToParse);

      // clear any existing tenant configurations
      this.#list = [];

      // loop thru  array adding them to internal list, this performs validation and connects to the database
      list.forEach((item) => this.add(item));

      // Return the array of tenant configuration objects
      return this.#list;
    } catch (error) {
      // If an error occurs, log it and throw the error
      console.error(`Error loading tenants from JSON file: ${error.message}`);
      throw new Error(error.message);
    }
  }

  /**
   * Saves the tenant configurations to a file, optionally encrypting the content if a key is provided.
   *
   * @param {string} filename - The name of the file to write to.
   * @param {string} [encryptKey=""] - The encryption key to encrypt the content (optional).
   * @throws {Error} Throws an error if file writing or encryption fails.
   */
  saveToFile(filename, encryptKey = "") {
    try {
      // Convert the tenants object to JSON string
      const jsonContent = JSON.stringify(this.#list, null, 2);

      // If an encryption key is provided, encrypt the content
      const contentToWrite = encryptKey
        ? encryptAES256(jsonContent, encryptKey)
        : jsonContent;

      // Write the content to the file (either encrypted or plain)
      fs.writeFileSync(filename, contentToWrite, "utf8");
    } catch (error) {
      // Log and throw if an error occurs
      console.error(`Error saving tenants to file: ${error.message}`);
      throw new Error(error.message);
    }
  }

  /**
   * Middleware function that adds the tenant to the request object if found.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  middleware(req, res, next) {
    // if locals is not defined then initialize it
    if (!req.locals) {
      req.locals = {};
    }

    // use request host to find tenant
    let tenant = this.find(req.host);

    // if tenant found
    if (tenant) {
      // assign to locals so it can be used in the view engine
      req.locals.tenant = tenant;

      // connect to database if first time this tenant is referenced
      if (!tenant.db) {
        tenant.db = this.#connectDBFunc(tenant);
      }

      // assign the tenant database to the request
      req.db = tenant.db;
    }

    // call the next middleware
    next();
  }
}

// export the tenant class
module.exports = Tenants;
