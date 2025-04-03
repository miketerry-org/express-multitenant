// tenant.js:

// "use strict";

// load all necessary modules
const Confirm = require("confirm-json");

class Tenant {
  #config = undefined;
  #db = undefined;
  #log = undefined;
  #mailer = undefined;
  #site = undefined;
  #validate = undefined;
  #createDBFunc = undefined;
  #createLogFunc = undefined;
  #createMailerFunc = undefined;

  constructor(config, createDBFunc, createLogFunc, createMailerFunc) {
    // keep a reference to the configuration object
    this.#config = config;
    this.#createDBFunc = createDBFunc;
    this.#createLogFunc = createLogFunc;
    this.#createMailerFunc = createMailerFunc;

    // initialize the validator instance
    this.#validate = new Confirm(this.#config);

    // call the method to validate the configuration object
    this.validateConfig();
  }

  get config() {
    return this.#config;
  }

  get db() {
    // if not yet connected to the database
    if (!this.#db) {
      // call the create db function if it is defined
      if (this.#createDBFunc && typeof this.#createDBFunc === "function") {
        this.#db = this.#createDBFunc(this.#config);
      } else {
        // throw error if the create db function is not defined
        throw new Error(`You must provide a "createDBFunc" function.`);
      }
    }

    // return the db connection
    return this.#db;
  }

  get errors() {
    return this.#validate.errors;
  }

  get log() {
    // if the log instance is not created
    if (!this.#log) {
      // initialize the log instance if the create log function is defined
      if (this.#createLogFunc && typeof this.#createLogFunc === "function") {
        this.#log = this.#createLogFunc(this.#config);
      } else {
        // throw an error if the create log function is undefined
        throw new Error(`You must provide a "createLogFunc" function.`);
      }
    }

    // return the log instance
    return this.#log;
  }

  get mailer() {
    // if the mailer instance is not created
    if (!this.#mailer) {
      // initialize the mailer instance if the create mailer function is defined
      if (
        this.#createMailerFunc &&
        typeof this.#createMailerFunc === "function"
      ) {
        this.#mailer = this.#createMailerFunc(this.#config);
      } else {
        throw new Error(`You must provide a "createMailerFunc" function.`);
      }
    }

    // return the mailer instance
    return this.#mailer;
  }

  get site() {
    if (!this.#site) {
      // Initialize an empty object to store site properties
      this.#site = {};

      // Loop through each property in this.#config
      for (const [key, value] of Object.entries(this.#config)) {
        // Check if the property name starts with "site_"
        if (key.startsWith("site_")) {
          // Add the property to this.#site with its corresponding value
          this.#site[key] = value;
        }
      }
    }

    // return the site related properties
    return this.#site;
  }

  get validate() {
    return this.#validate;
  }

  validateConfig() {
    // first, validate tenant and node identifiers
    this.validate
      .isInteger("tenant_id", undefined, 1, 100000)
      .isInteger("node_id", undefined, 1, 1000)
      .isString("domain", undefined, 1, 255);

    // call all validation methods
    this.validateDB();
    this.validateLog();
    this.validateMailer();
    this.validateSite();
  }

  validateDB() {
    this.validate.isString("db_url", undefined, 1, 255);
  }

  validateLog() {
    this.validate.isString("log_folder", "logs", 1, 255);
  }

  validateMailer() {
    this.validate
      .isString("mailer_host", undefined, 1, 255)
      .isString("mailer_username", undefined, 1, 255)
      .isString("mailer_password", undefined, 1, 255)
      .isString("mailer_sender", undefined, 1, 255);
  }

  validateSite() {
    this.validate
      .isString("site_title", undefined, 1, 255)
      .isString("site_slogan", undefined, 1, 255)
      .isString("site_owner", undefined, 1, 255)
      .isInteger("site_copyright", undefined, 1980, 9999)
      .isArray("site_roles")
      .isString("site_support_email", undefined, 1, 255)
      .isString("site_support_url", undefined, 1, 255);
  }
}

module.exports = Tenant;
