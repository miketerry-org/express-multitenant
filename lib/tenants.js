// tenants.js:

"use strict";

// load all necessary packages
const Tenant = require("./tenant");
const TenantRule = require("./tenantRule");

class Tenants {
  // private values
  #list;

  constructor() {
    this.#list = [];
  }

  add(data) {
    if (!data || typeof data !== "object") {
      throw new Error(`The "data" parameter must be an object`);
    }

    // verify the tenant JSON data object is valid
    const rule = new TenantRule();

    // verify the data is a tenant definition
    rule.check(data);

    // if no error then add to array
    this.#list.push(data);
  }

  get length() {
    return this.#list.length;
  }
}

// export the tenants class
module.exports = Tenants;
