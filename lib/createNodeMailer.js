// createNodeMailer.js:

"use strict";

// load all necessary modules
const { serverLog } = require("./serverLog");

// function to create a node mailer object
async function createNodeMailer(tenant) {
  try {
    // perform validation  of node mailer configuration values
    let errorCount = tenant.errors.length;
    tenant.validate
      .isString("mailer_host", undefined, 1, 255)
      .isString("mailer_username", undefined, 1, 255)
      .isString("mailer_password", undefined, 1, 255)
      .isString("mailer_sender", undefined, 1, 255);
    if (validate.errors.length > errorCount) {
      throw new Error(tenant.validate.errors.join("\n"));
    }

    // only load nodemailer module if function is called
    const nodemailer = require("nodemailer");

    // return object with tenant, nodemailer transport and send mail method
    return {
      tenant,
      transport,
      send: (message) => {
        transport.sendMail(message, (err, info) => {
          if (err) {
            tenant.log.error("SendEmail Error:", err);
          } else {
            tenant.log.info("Email sent:", info);
          }
        });
      },
    };
  } catch (err) {
    serverLog.error(err.message);
    throw new Error(err.message);
  }
}

// export the create nodemailer function
module.exports = createNodeMailer;
