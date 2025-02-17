// tenant.test.js:

"use strict";
// load all required packages
const Tenant = require("../lib/tenant");
//const rule = require("../lib/tenantRule");
const data = require("./data");

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
  expect(tenant.database.url).toBe(data[0].database.url);
  expect(tenant.database.host).toBe(data[0].database.host);
  expect(tenant.database.port).toBe(data[0].database.port);
  expect(tenant.database.username).toBe(data[0].database.username);
  expect(tenant.database.password).toBe(data[0].database.password);
  expect(tenant.database.ssl).toBe(data[0].database.ssl);
  expect(tenant.database.charset).toBe(data[0].database.charset);
  expect(tenant.database.pool.min).toBe(data[0].database.pool.min);
  expect(tenant.database.pool.max).toBe(data[0].database.pool.max);
  expect(tenant.database.pool.idle).toBe(data[0].database.pool.idle);
  expect(tenant.database.encrypt_cypher).toBe(data[0].database.encrypt_cypher);
  expect(tenant.database.encrypt_key).toBe(data[0].database.encrypt_key);
  expect(tenant.smtp.host).toBe(data[0].smtp.host);
  expect(tenant.smtp.username).toBe(data[0].smtp.username);
  expect(tenant.smtp.password).toBe(data[0].smtp.password);
  expect(tenant.smtp.sender).toBe(data[0].smtp.sender);
});
