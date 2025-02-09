// tenant.js:

"use strict";

class Tenant {
  // private variables copied from config object passed to constructor
  #tenant_id;
  #node_id;
  #hostname;
  #locals;
  #database;
  #smtp;
  #dbConnectFunc;

  constructor(config, dbConnectFunc) {
    this.#tenant_id = config.tenant_id;
    this.#node_id = config.node_id;
    this.#hostname = config.hostname;
    this.#locals = { ...config.locals };
    this.#database = { ...config.database };
    this.smtp = { ...config.smtp };
    this.#dbConnectFunc = dbConnectFunc;
  }

  get tenant_id() {
    return this.#tenant_id;
  }

  get node_id() {
    return this.#node_id;
  }

  get hostname() {
    return this.#hostname;
  }

  get locals() {
    return this.#locals;
  }

  get database() {
    return this.#database;
  }

  get smtp() {
    return this.#smtp;
  }

  get dbConnect() {
    return this.#dbConnectFunc;
  }
}

module.exports = Tenant;
