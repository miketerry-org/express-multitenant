// createNodemailer.js:

"use strict";

// Load all necessary modules
const { serverLog } = require("./serverLog");

// Function to create a NodeMailer transport instance
async function createNodeMailer(config, validate) {
  try {
    // Perform validation of NodeMailer configuration values
    const errorCount = validate.errors.length;

    validate
      .isString("mailer_host", undefined, 1, 255)
      .isInteger("mailer_port", undefined, 1, 65000)
      .isString("mailer_username", undefined, 1, 255, false)
      .isString("mailer_password", undefined, 1, 255, false)
      .isString("mailer_sender", undefined, 1, 255);

    if (validate.errors.length > errorCount) {
      throw new Error(
        `Tenant ${config.tenant_id}: ${validate.errors.join("\n")}`
      );
    }

    // Load nodemailer only when required
    const nodemailer = require("nodemailer");

    // Create the transport using tenant config
    const transport = nodemailer.createTransport({
      host: config.mailer_host,
      port: config.mailer_port,
      secure: true, // Use SSL/TLS
      auth: {
        user: config.mailer_username,
        pass: config.mailer_password,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs (optional)
      },
    });

    // Return the configured transport
    return transport;
  } catch (err) {
    serverLog.error(`Tenant ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant ${config.tenant_id}: ${err.message}`);
  }
}

// Export the createNodeMailer function
module.exports = createNodeMailer;
