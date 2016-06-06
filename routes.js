"use strict"
const express = require('express'),
      routes = express.Router(),
      https = require('https');

routes
.get('/api/:keyword', function (req, res) {
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

module.exports = routes;