// tenants.js

"use strict";

// Load all necessary packages
const Confirm = require("confirm-json");
const TopSecret = require("topsecret");
const Tenant = require("./tenant");

class TenantsInternal {
  // Private fields
  #tenantClass;
  #list;
  #topsecret;

  constructor(tenantClass = Tenant) {
    this.#tenantClass = tenantClass;
    this.#list = [];
    this.#topsecret = new TopSecret();
  }

  // Add a single tenant
  add(tenantConfig) {
    if (!tenantConfig || typeof tenantConfig !== "object") {
      throw new Error(`The "tenantConfig" parameter must be a valid object`);
    }

    const tenant = new this.#tenantClass(tenantConfig);

    if (tenant.errors.length === 0) {
      this.#list.push(tenant);
    } else {
      throw new Error(`Invalid Tenant: ${tenant.errors.join(",")}`);
    }

    return tenant;
  }

  // Add a list of tenant configs
  addList(tenantConfigList) {
    console.log("tenantsConfigList", tenantConfigList);
    tenantConfigList.forEach((tenantConfig) => this.add(tenantConfig));
  }

  // Find a tenant by domain
  find(domain) {
    return this.#list.find((item) => {
      return item.domain.toLowerCase() === domain.toLowerCase();
    });
  }

  // Load from encrypted file
  loadFromFile(filename) {
    this.addList(this.#topsecret.decryptJSONFromFile(filename));
  }

  // Getters
  get length() {
    return this.#list.length;
  }

  get list() {
    return this.#list;
  }

  get key() {
    return this.#topsecret.key;
  }

  set key(value) {
    this.#topsecret.key = value;
  }

  get password() {
    return this.#topsecret.password;
  }

  set password(value) {
    this.#topsecret.password = value;
  }
}

// Proxy wrapper to support tenants[0] access
function Tenants(tenantClass) {
  const internal = new TenantsInternal(tenantClass);

  return new Proxy(internal, {
    get(target, prop, receiver) {
      // If accessing a numeric index, redirect to the internal list
      if (!isNaN(prop)) {
        return target.list[prop];
      }

      // Otherwise, default to the class property
      const value = Reflect.get(target, prop, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },

    set(target, prop, value) {
      if (!isNaN(prop)) {
        target.list[prop] = value;
        return true;
      }

      return Reflect.set(target, prop, value);
    },

    has(target, prop) {
      if (!isNaN(prop)) {
        return prop in target.list;
      }

      return prop in target;
    },

    ownKeys(target) {
      return Reflect.ownKeys(target).concat(Object.keys(target.list));
    },

    getOwnPropertyDescriptor(target, prop) {
      if (!isNaN(prop)) {
        return Object.getOwnPropertyDescriptor(target.list, prop);
      }

      return Object.getOwnPropertyDescriptor(target, prop);
    },
  });
}

module.exports = Tenants;
