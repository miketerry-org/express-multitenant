// nodeMailerService:

"use strict";

// load all required packages    s
const Service = require("./service");
const nodemailer = require("nodemailer");

function createNodemailer(tenant) {
  // perform validatation of node mailer configuration values
  let errorCount = tenant.errors.length;
  tenant.validate
    .isString("mailer_host", undefined, 1, 255)
    .isString("mailer_username", undefined, 1, 255)
    .isString("mailer_password", undefined, 1, 255)
    .isString("mailer_sender", undefined, 1, 255);

  // if any additional errors then return empty object
  if (validate.errors.length > errorCount) {
    return {};
  }

  // create the nodemailer transport using tenant configuration values
  let transport = nodemailer.createTransport({
    host: tenant.config.smtp_host,
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
      user: tenant.config.smtp_username,
      pass: tenant.config.smtp_password,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certs (adjust based on your needs)
    },
  });

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
}

class NodemailerService extends Service {
  constructor(tenant) {
    super.constructor(tenant, "mailer", createNodemailer(tenant));
  }
}

// export the node mailer service
module.exports = NodemailerService;
