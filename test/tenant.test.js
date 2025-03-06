// tenant.test.js:

"use strict";
// load all required packages
const Tenant = require("../lib/tenant");
//const rule = require("../lib/tenantRule");
const data = require("./data");

function fakeDBConnect(config) {
  return undefined;
}

test("new tenant", () => {
  const tenant = new Tenant(data[0]);
  expect(tenant.tenant_id).toBe(data[0].tenant_id);
  expect(tenant.node_id).toBe(data[0].node_id);
  expect(tenant.hostname).toBe(data[0].hostname);
  expect(tenant.locals.site_title).toBe(data[0].locals.site_title);
  expect(tenant.locals.site_slogan).toBe(data[0].locals.site_slogan);
  expect(tenant.locals.site_owner).toBe(data[0].locals.site_owner);
  expect(tenant.locals.site_copyright).toBe(data[0].locals.site_copyright);
  expect(tenant.locals.roles).toStrictEqual(data[0].locals.roles);
  expect(tenant.dbConfig.url).toBe(data[0].dbConfig.url);
  expect(tenant.smtpConfig.host).toBe(data[0].smtpConfig.host);
  expect(tenant.smtpConfig.username).toBe(data[0].smtpConfig.username);
  expect(tenant.smtpConfig.password).toBe(data[0].smtpConfig.password);
  expect(tenant.smtpConfig.sender).toBe(data[0].smtpConfig.sender);
  expect(tenant.connected).toBe(false);
});

test("set dbConnectFunc", () => {
  const tenant = new Tenant(data[0]);
  tenant.dbConnectFunc = fakeDBConnect;
  expect(tenant.dbConnectFunc).toBe(fakeDBConnect);
});
