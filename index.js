"use strict"
require('dotenv').config();
const express = require('express'),
      app = express(),
      https = require('https'),
      portNumber = process.env.PORT || process.argv[2] || 8080;

app.get('/api/:keyword', function (req, res) {
  https.get(`https://www.googleapis.com/customsearch/v1?q=${req.params.keyword}&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${process.env.cx}`, function (result) {
    result.setEncoding("utf8");
    let json = "";
    result
    .on('data', function (chunk) {
      json += chunk;
    })
    .on('end', function () {
      json = JSON.parse(json);
      res.send(json.items);
    });
  });
});

app.listen(portNumber, function () {
  console.log("Listening on port " + portNumber);
});
