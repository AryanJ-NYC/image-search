"use strict"
const express = require('express'),
      routes = express.Router(),
      https = require('https');

routes
.get('/imagesearch/:keyword', function (req, res) {
  req.query.offset = req.query.offset || 1;
  https
  .get(`https://www.googleapis.com/customsearch/v1?q=${req.params.keyword}&searchType=image&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${process.env.cx}&start=${req.query.offset}`, function (result) {
    result.setEncoding("utf8");
    let json = "";
    result
    .on('data', function (chunk) {
      json += chunk;
    })
    .on('end', function () {
      json = JSON.parse(json);
      let images = [];
      json.items.forEach(function (item) {
        images.push({
          url: item.link,
          snippet: item.snippet,
          thumbnail: item.image.thumbnailLink,
          context: item.image.contextLink
        });
      });
      res.json(images);
    });
  });
});

module.exports = routes;
