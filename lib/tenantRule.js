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

class TenantRule {
  #rules;

  constructor(roles = ["Guest", "subscriber", "Admin"]) {
    this.#rules = new ObjectRule("", "", false, [
      new IntegerRule("tenant_id", "", true, 1),
      new IntegerRule("node_id", "", true, 1),
      new StringRule("hostname", "", true, 1),
      new ObjectRule("locals", "", true, [
        new StringRule("site_title", "", true, 1, 255),
        new StringRule("site_slogan", "", true, 1, 255),
        new StringRule("site_owner", "", true, 1, 255),
        new IntegerRule("site_copyright", "", true, 1),
        new ArrayRule("roles", "", true, 3, 255),
      ]),
      new ObjectRule("dbConfig", "", true, [
        new StringRule("url", "", false, 1, 255),
        new ObjectRule("options", "", true, []),
      ]),
      new ObjectRule("smtpConfig", "", true, [
        new StringRule("host", "", true, 1, 255),
        new IntegerRule("port", "", false, 1, 60000),
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
