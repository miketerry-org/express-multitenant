// createNodeMailer.js:

"use strict";

// load all necessary modules
const { serverLog } = require("./serverLog");

// function to create a node mailer object
async function createNodeMailer(config, validate, callback) {
  try {
    // perform validation  of node mailer configuration values
    let errorCount = tenant.errors.length;
    validate
      .isString("mailer_host", undefined, 1, 255)
      .isInteger("smtp_port", undefined, 1, 65000)
      .isString("mailer_username", undefined, 1, 255)
      .isString("mailer_password", undefined, 1, 255)
      .isString("mailer_sender", undefined, 1, 255);
    if (validate.errors.length > errorCount) {
      throw new Error(validate.errors.join("\n"));
    }

    // only load nodemailer module if function is called
    const nodemailer = require("nodemailer");

    // create the nodemailer transport using tenant configuration values
    let transport = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: true, // Use SSL/TLS
      auth: {
        user: config.smtp_username,
        pass: config.smtp_password,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs (adjust based on your needs)
      },
    });

    // assign object with  nodemailer transport
    callback(transport);
  } catch (err) {
    serverLog.error(`Tenant: ${config.tenant_id}: ${err.message}`);
    throw new Error(`Tenant: ${config.tenant_id}: ${err.message}`);
  }
}

// export the create nodemailer function
module.exports = createNodeMailer;
