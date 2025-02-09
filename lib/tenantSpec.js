// tenantSpec.js:

("use strict");

const {
  Arrayspec,
  BooleanSpec,
  IntegerSpec,
  ObjectSpec,
  StringSpec,
} = require("json-spec");

const spec = new ObjectSpec("", "", false, [
  new IntegerSpec("tenant_id", "", true, 1),
  new IntegerSpec("node_id", "", true, 1),
  new StringSpec("hostname", "", true, 1),
  new ObjectSpec("locals", "", true, [
    new StringSpec("title", "", true, 1, 255),
    new StringSpec("slogan", "", true, 1, 255),
    new StringSpec("owner", "", true, 1, 255),
    new IntegerSpec("copyright", "", true, 1),
    new Arrayspec("roles", "", StringSpec, true, 1),
  ]),
  new ObjectSpec("database", "", true, [
    new StringSpec("url", "", false, 1, 255),
    new StringSpec("host", "", false, 1, 255),
    new IntegerSpec("port", "", false, 1000, 60000),
    new StringSpec("database", "", false, 1, 255),
    new StringSpec("username", "", false, 1, 255),
    new StringSpec("password", "", false, 1, 255),
    new BooleanSpec("ssl", "", false),
    new StringSpec("charset", "", false, 1, 255),
    new ObjectSpec("pool", "", false, [
      new IntegerSpec("min", "", false, 1, 1000),
      new IntegerSpec("max", "", false, 1, 1000),
      new IntegerSpec("timeout", "", false),
    ]),
    new StringSpec("encrypt_cypher", "", false, 1, 255),
    new StringSpec("eencrypt_key", "", false, 1, 255),
  ]),
  new ObjectSpec("smtp", "", true, [
    new StringSpec("host", "", true, 1, 255),
    new IntegerSpec("port", "", true, 1000, 60000),
    new StringSpec("username", "", true, 1, 255),
    new StringSpec("password", "", true, 1, 255),
    new StringSpec("sender", "", true, 1, 255),
  ]),
]);

// export the spec which is used to validate the configuration for a tenant class
module.exports = spec;
