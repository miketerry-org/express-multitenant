// data.js:

"use strict";

const validConfig = {
  tenant_id: 1,
  node_id: 1,
  domain: "www.sample.com",
  site_title: "Sample Web site",
  site_slogan: "Slogan for sample web site",
  site_owner: "Sample LLC",
  site_copyright: 2025,
  site_roles: ["Guest", "subscriber", "Support", "Admin"],
  site_support_email: "support@sample.com",
  site_support_url: "https://www.sample.com/support",
  db_url: "mongodb://localhost:27017/test",
  log_folder: "./logs",
  mailer_host: "smtp.sample.com",
  mailer_username: "it@sample.com",
  mailer_password: "Abcdef-123456",
  mailer_sender: "support@sample.com",
};

const invalidConfig = {
  tenant_id: "a",
  node_id: "b",
  domainX: "www.sample.com",
  site_title: "Sample Web site",
  site_slogan: "Slogan for sample web site",
  site_owner: "Sample LLC",
  site_copyright: 2025,
  site_roles: ["Guest", "subscriber", "Support", "Admin"],
  site_support_email: "support@sample.com",
  site_support_url: "https://www.sample.com/support",
  db_url: "./data.sqlite",
  log_folder: "./logs",
  mailer_host: "smtp.sample.com",
  mailer_username: "it@sample.com",
  mailer_password: "Abcdef-123456",
  mailer_sender: "support@sample.com",
};

const emptyConfig = {};

module.exports = { validConfig, invalidConfig, emptyConfig };
