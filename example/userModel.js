// userModel.js:

"use strict";

// Load all necessary modules
const { DataTypes, Model } = require("better-sqlite3-orm");

// desstruct needed data types
const { primaryInteger, boolean, string, timestamp } = DataTypes;

// define the user columns
const userColumns = [
  primaryInteger("id"),
  string("firstname", 20, true),
  string("lastname", 20, true),
  string("email", 60, true, true, true),
  string("password", 60, true),
  boolean("active", true),
  timestamp("created_at", true),
  timestamp("updated_at", false),
];

class UserModel extends Model {
  constructor(db) {
    // Pass required arguments to the Model constructor
    super(db, "users", userColumns, {});
  }

  findByEmail(value) {
    return this.findByColumn("email", value);
  }
}

module.exports = UserModel;
