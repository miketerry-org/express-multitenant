"use strict";

const fs = require("fs");
const crypto = require("crypto");

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

function loadTenantsFromJSONFile(filename, encryptKey = "") {
  try {
    // Read the file synchronously
    const fileContent = fs.readFileSync(filename, "utf8");

    // If an encryption key is provided, decrypt the content
    const contentToParse = encryptKey
      ? decryptAES256(fileContent, encryptKey)
      : fileContent;

    // Parse the content (decrypted or plain) as JSON
    const tenants = JSON.parse(contentToParse);

    // Return the parsed JSON (which should be an array of objects)
    return tenants;
  } catch (error) {
    // If an error occurs, log it and throw the error
    console.error(`Error loading tenants from JSON file: ${error.message}`);
    throw new Error(error.message);
  }
}

function saveTenantsToJSONFile(filename, tenants, encryptKey = "") {
  try {
    // Convert the tenants object to JSON string
    const jsonContent = JSON.stringify(tenants, null, 2);

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

function multitenantMiddleware(req, res, next) {
  next();
}

module.exports = {
  loadTenantsFromJSONFile,
  saveTenantsToJSONFile,
  multitenantMiddleware,
};
