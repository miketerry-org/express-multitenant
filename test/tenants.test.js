// tenants.test.js:

// load all required packages
const Tenants = require("../lib/tenants");
const data = require("./data");

function fakeDBConnect(config) {
  return undefined;
}

test("new tenants", () => {
  const tenants = new Tenants();
  expect(tenants.length).toBe(0);
});

test("tenants.add", () => {
  const tenants = new Tenants();
  tenants.add(data[0]);
  expect(tenants.length).toBe(1);
});
