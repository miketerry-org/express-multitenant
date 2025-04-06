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
  #services = {};

  constructor(config, serviceClasses = []) {
    // keep a reference to the configuration object
    this.#config = config;

    // initialize the validator instance
    this.#validate = new Confirm(this.#config);
    console.log("this.#validate", typeof this.#validate);

    // call the method to validate the configuration object
    this.validateConfig();

    // loop thru all service classes
    serviceClasses.forEach((serviceClass) => {
      // instanciate the service class
      let service = new serviceClass(this, this.#config, this.validate);

      // assign the new service instance to the services object
      this.#services[service.name] = service.value;
    });
  }

  get config() {
    return this.#config;
  }

  get db() {
    // if we have not cached the db connection variable
    if (!this.#db) {
      // if there is a db service then cache the db variable
      if (this.#services.db !== undefined) {
        this.#db = this.#services.db;
      } else {
        // no database service so throw error
        throw new Error(`The "db" service is not defined`);
      }
    }

    // return the database connection
    return this.#db;
  }

  get errors() {
    return this.#validate.errors;
  }

  get log() {
    // if we have not cached the log variable
    if (!this.#log) {
      // if there is a log service provided then cache the log
      if (this.#services.log !== undefined) {
        this.#log = this.#services.log;
      } else {
        // no log service provided so throw error
        throw new Error(`The "log" service is not defined.`);
      }
    }

    // return the cached log variable
    return this.#log;
  }

  get mailer() {
    // if we have not cached the mailer variable
    if (!this.#mailer) {
      // if a mailer service is defined
      if (this.#services.mailer) {
        // cache the mailer service
        this.#mailer = this.#services.mailer;
      } else {
        // no mailer service so throw an error
        throw new Error(`The "mailer" service is not defined.`);
      }
    }

    // return the cached mailer service
    return this.#mailer;
  }

  get site() {
    // if we have not cached the site variables
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

    // return the cached site related properties
    return this.#site;
  }

  get validate() {
    console.log("inside");
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
