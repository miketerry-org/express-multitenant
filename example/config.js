// config.js:

"use strict";

const config = {
  tenant_id: 1,
  node_id: 1,
  domain: "www.example.com",
  site_title: "example Web site",
  site_slogan: "Slogan for example web site",
  site_owner: "example LLC",
  site_copyright: 2025,
  site_roles: ["Guest", "subscriber", "Support", "Admin"],
  site_support_email: "support@example.com",
  site_support_url: "https://www.example.com/support",
  db_url: "data.sqlite",
  db_cyper: "",
  db_key: "",
  log_folder: "./logs",
  mailer_host: "smtp.example.com",
  mailer_username: "it@example.com",
  mailer_password: "Abcdef-123456",
  mailer_sender: "support@example.com",
};

module.exports = config;
