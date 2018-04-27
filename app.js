const express = require("express");
const app = express();
const ejs = require("ejs");
const axios = require("axios");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;
