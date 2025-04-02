// tenant.test.js

"use strict";

// load necessary packages
const { describe, it } = require("node:test");
const assert = require("assert");
const Tenant = require("../lib/tenant");
const { validConfig, invalidConfig, emptyConfig } = require("./data");

describe("Tenant class", () => {
  describe("valid tenant config", () => {
    it("should be valid tenant configuration", () => {
      let tenant = new Tenant(validConfig);
      assert.equal(tenant.errors.length, 0);
    });
  });

  describe("invalid tenant config", () => {
    it("should be invalid tenant configuration", () => {
      let tenant = new Tenant(invalidConfig);
      assert.equal(tenant.errors.length, 3);
    });
  });

  describe("emptyConfig tenant config", () => {
    it("should be invalid tenant configuration", () => {
      let tenant = new Tenant(emptyConfig);
      assert.equal(tenant.errors.length, 15);
    });
  });
});
