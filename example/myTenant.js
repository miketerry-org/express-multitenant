// myTenant.js:

"use strict";

// load all necessary modules
const path = require("path");
const { Tenant } = require("../index");
const { Database } = require("better-sqlite3-orm");

class MyTenant extends Tenant {
  createDB(config) {
    // create an instance of the database object
    let database = new Database();

    // destructure the database connection values
    let { db_url, db_cyper, db_key } = { ...config };

    // connect to the database
    database.connect(path.resolve(db_url), db_cyper, db_key);

    // return the database connection
    return database;
  }
}

// export my tenant class
module.exports = MyTenant;
