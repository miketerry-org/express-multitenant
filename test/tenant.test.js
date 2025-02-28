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
  expect(tenant.locals.title).toBe(data[0].locals.title);
  expect(tenant.locals.slogan).toBe(data[0].locals.slogan);
  expect(tenant.locals.owner).toBe(data[0].locals.owner);
  expect(tenant.locals.copyright).toBe(data[0].locals.copyright);
  expect(tenant.locals.roles).toStrictEqual(data[0].locals.roles);
  expect(tenant.dbConfig.url).toBe(data[0].dbConfig.url);
  expect(tenant.dbConfig.host).toBe(data[0].dbConfig.host);
  expect(tenant.dbConfig.port).toBe(data[0].dbConfig.port);
  expect(tenant.dbConfig.username).toBe(data[0].dbConfig.username);
  expect(tenant.dbConfig.password).toBe(data[0].dbConfig.password);
  expect(tenant.dbConfig.ssl).toBe(data[0].dbConfig.ssl);
  expect(tenant.dbConfig.charset).toBe(data[0].dbConfig.charset);
  expect(tenant.dbConfig.pool.min).toBe(data[0].dbConfig.pool.min);
  expect(tenant.dbConfig.pool.max).toBe(data[0].dbConfig.pool.max);
  expect(tenant.dbConfig.pool.idle).toBe(data[0].dbConfig.pool.idle);
  expect(tenant.dbConfig.encrypt_cypher).toBe(data[0].dbConfig.encrypt_cypher);
  expect(tenant.dbConfig.encrypt_key).toBe(data[0].dbConfig.encrypt_key);
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
