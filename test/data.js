// data.js:

const data = [
  {
    tenant_id: 1,
    node_id: 1,
    hostname: "www.mvc-starter",
    locals: {
      site_title: "MVC Starter (public)",
      site_slogan:
        "Best little Model, View, Controller web application starter",
      site_owner: "miketerry.org",
      site_copyright: 2025,
      roles: ["Guest", "subscriber", "Admin"],
    },
    dbConfig: {
      url: "/data/mvc-starter.sqlite",
      options: {},
    },
    smtpConfig: {
      host: "smtpConfig.miketerry.org",
      port: 587,
      username: "support@miketerry.org",
      password: "abcd-1234",
      sender: "support@miketerry.org",
    },
  },
  {
    tenant_id: 2,
    node_id: 1,
    hostname: "alpha.mvc-starter",
    locals: {
      site_title: "MVC Starter (alpha)",
      site_slogan:
        "Best little Model, View, Controller web application starter",
      site_owner: "miketerry.org",
      site_copyright: 2025,
      roles: ["Guest", "subscriber", "designer", "Admin"],
    },
    dbConfig: {
      url: "/data/mvc-starter-alpha.sqlite",
      options: {},
    },
    smtpConfig: {
      host: "smtpConfig.miketerry.org",
      port: 587,
      username: "support@miketerry.org",
      password: "abcd-1234",
      sender: "support@miketerry.org",
    },
  },
  {
    tenant_id: 3,
    node_id: 1,
    hostname: "beta.mvc-starter",
    locals: {
      site_title: "MVC Starter (beta)",
      site_slogan:
        "Best little Model, View, Controller web application starter",
      site_owner: "miketerry.org",
      site_copyright: 2025,
      roles: ["Guest", "subscriber", "Admin"],
    },
    dbConfig: {
      url: "/data/mvc-starter-beta.sqlite",
      options: {},
    },
    smtpConfig: {
      host: "smtpConfig.miketerry.org",
      port: 587,
      username: "support@miketerry.org",
      password: "abcd-1234",
      sender: "support@miketerry.org",
    },
  },
];

module.exports = data;
