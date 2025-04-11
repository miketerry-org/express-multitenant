const Tenants = require("./tenants");

const tenants = Tenants();

tenants.add({ domain: "example.com" });
tenants.add({ domain: "myapp.io" });

console.log(tenants[0]); // First tenant
console.log(tenants.find("myapp.io")); // Lookup by domain
console.log(tenants.length); // 2
