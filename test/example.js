const data = {
  tenant_id: 1,
  node_id: 1,
  hostname: "www.mvc-starter",
  locals: {
    title: "MVC Starter (public)",
    slogan: "Best little Model, View, Controller web application starter",
    owner: "miketerry.org",
    copyright: 2025,
    roles: ["Guest", "subscriber", "Admin"],
  },
  database: {
    url: "/data/mvc-starter.sqlite",
    host: null,
    port: null,
    database: null,
    username: null,
    password: null,
    ssl: false,
    charset: null,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    encrypt_cypher: "",
    encrypt_key: "",
  },
  smtp: {
    host: "smtp.miketerry.org",
    port: 587,
    username: "support@miketerry.org",
    password: "abcd-1234",
    sender: "support@miketerry.org",
  },
};

spec.check(data);
