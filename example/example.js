// example.js:

"use strict";

// load all necessary modules
const { Tenants } = require("../index");
const MyTenant = require("./myTenant");
const config = require("./config");
const UserModel = require("./userModel");

// instanicate a new instance of my extended tenant class
const tenant = new MyTenant(config);

// create a instance of the user model
let user = new UserModel(tenant.db);
// create the table
user.createTable();

// insert a new user into the table
user.firstname = "Donald";
user.lastname = "Duck";
user.email = "donald.duck@disney.com";
user.password = "abcd-1234";
user.active = true;
let data = user.insert();

// disconnect from the database
tenant.db.disconnect();
