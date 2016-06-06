"use strict"
require('dotenv').config();
const express = require('express'),
      app = express(),
      https = require('https'),
      portNumber = process.env.PORT || process.argv[2] || 8080;

https.get(`https://www.googleapis.com/customsearch/v1?q=love&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${process.env.cx}`, function (res) {
  res.setEncoding("utf8");
  let json = "";
  res
  .on('data', function (chunk) {
    json += chunk;
  })
  .on('end', function () {
    json = JSON.parse(json);
    console.log(json.items);
  });
});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
