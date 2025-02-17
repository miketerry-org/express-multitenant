// tenantRule.js:

"use strict";

// load all necessary packages
const {
  ArrayRule,
  BooleanRule,
  IntegerRule,
  ObjectRule,
  StringRule,
} = require("json-Rule");
const data = require("../test/data");

class TenantRule {
  #rules;

  constructor(roles = ["Guest", "subscriber", "Admin"]) {
    this.#rules = new ObjectRule("", "", false, [
      new IntegerRule("tenant_id", "", true, 1),
      new IntegerRule("node_id", "", true, 1),
      new StringRule("hostname", "", true, 1),
      new ObjectRule("locals", "", true, [
        new StringRule("title", "", true, 1, 255),
        new StringRule("slogan", "", true, 1, 255),
        new StringRule("owner", "", true, 1, 255),
        new IntegerRule("copyright", "", true, 1),
        //        new ArrayRule("roles", "", true, 3),
      ]),
      new ObjectRule("database", "", true, [
        new StringRule("url", "", false, 1, 255),
        new StringRule("host", "", false, 1, 255),
        new IntegerRule("port", "", false),
        new StringRule("database", "", false, 1, 255),
        new StringRule("username", "", false, 1, 255),
        new StringRule("password", "", false, 1, 255),
        new BooleanRule("ssl", "", false),
        new StringRule("charset", "", false, 1, 255),
        new ObjectRule("pool", "", false, [
          new IntegerRule("min", "", false, 1, 1000),
          new IntegerRule("max", "", false, 1, 1000),
          new IntegerRule("timeout", "", false),
        ]),
        new StringRule("encrypt_cypher", "", false, 1, 255),
        new StringRule("eencrypt_key", "", false, 1, 255),
      ]),
      new ObjectRule("smtp", "", true, [
        new StringRule("host", "", true, 1, 255),
        new IntegerRule("port", "", true, 1, 60000),
        new StringRule("username", "", true, 1, 255),
        new StringRule("password", "", true, 1, 255),
        new StringRule("sender", "", true, 1, 255),
      ]),
    ]);
  }

  check(data) {
    this.#rules.check(data);
  }
}

// export the tenant rule class
module.exports = TenantRule;
