// service.js:

"use strict";

class Service {
  #config = undefined;
  #name = undefined;
  #value = undefined;

  constructor(tenant, name, value) {
    // ensure the tenant parameter is passed and it is an object
    if (!tenant || typeof tenant !== "object") {
      throw new Error(
        `The "tenant" property must be passed to the "${this.constructor.name} constructor and be an object`
      );
    }

    // ensure the name parameter is passed and it is a string
    if (!name || typeof name !== "string") {
      throw new Error(
        `The "name" property must be passed to the "${this.constructor.name}" constructor`
      );
    }

    // ensure the value parameter is passed and it is an object
    if (!value || typeof value !== "object") {
      throw new Error(
        `The "value" property must be passed to the "${this.constructor.name} constructor and be an object`
      );
    }

    // assign the private properties
    this.#tenant = tenant;
    this.#name = name;
    this.#value = value;
  }

  get config() {
    return this.#tenant.config;
  }

  get name() {
    return this.#name;
  }

  get tenant() {
    return this.#tenant;
  }

  get value() {
    return this.#value;
  }
}

// export the base service class
module.exports = Service;
