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
  constructor() {
    this.#list = [];
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

      // loop thru  array adding them to internal list, this performs validation
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
    let tenant = this.find(req.host);
    if (tenant) {
      req.tenant = tenant;
    }
    next(); // Proceed to next middleware
  }
}

// export the tenant class
module.exports = Tenants;
