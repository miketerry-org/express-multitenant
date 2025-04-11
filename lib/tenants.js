// tenants.js:

"use strict";

// Load all necessary packages
const Confirm = require("confirm-json");
const TopSecret = require("topsecret");
const Tenant = require("./tenant");

class TenantsInternal {
  constructor(tenantClass = Tenant) {
    this._tenantClass = tenantClass;
    this._list = [];
    this._topsecret = new TopSecret();
  }

  /**
   * Add a single tenant from a config object.
   */
  async add(tenantConfig) {
    if (!tenantConfig || typeof tenantConfig !== "object") {
      throw new Error(`The "tenantConfig" parameter must be a valid object`);
    }

    const tenant = new this._tenantClass(tenantConfig);

    try {
      // Wait for async service initialization
      await tenant.defineServices();
    } catch (err) {
      throw new Error(
        `Error while defining services for tenant ${tenantConfig.tenant_id}: ${err.message}`
      );
    }

    if (tenant.errors.length === 0) {
      this._list.push(tenant);
    } else {
      throw new Error(`Invalid Tenant: ${tenant.errors.join(", ")}`);
    }

    return tenant;
  }

  /**
   * Add a list of tenant configs (sequentially).
   */
  async addList(tenantConfigList) {
    for (const tenantConfig of tenantConfigList) {
      await this.add(tenantConfig);
    }
  }

  /**
   * Load tenant configuration from an encrypted file.
   */
  async loadFromFile(filename) {
    const decryptedList = this._topsecret.decryptJSONFromFile(filename);
    await this.addList(decryptedList);
  }

  /**
   * Find a tenant by domain.
   */
  find(domain) {
    return this._list.find(
      (tenant) => tenant.config.domain.toLowerCase() === domain.toLowerCase()
    );
  }

  // Getters for external access
  get length() {
    return this._list.length;
  }

  get list() {
    return this._list;
  }

  get key() {
    return this._topsecret.key;
  }

  set key(value) {
    this._topsecret.key = value;
  }

  get password() {
    return this._topsecret.password;
  }

  set password(value) {
    this._topsecret.password = value;
  }
}

/**
 * Proxy wrapper to expose tenants as both an array and an object.
 */
function Tenants(tenantClass) {
  const internal = new TenantsInternal(tenantClass);

  return new Proxy(internal, {
    get(target, prop, receiver) {
      if (!isNaN(prop)) {
        return target.list[prop];
      }

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
