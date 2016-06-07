"use strict";
const routes = require('express').Router(),
      https = require('https'),
      Searchlog = require('./Searchlog');

routes
.get('/imagesearch/:keyword', function (req, res) {
  let offset = req.query.offset || 1,
      keyword = req.params.keyword,
      searchlog = new Searchlog({ keyword: keyword });
  searchlog.save(function (err) {
    if (err) {
      console.error("There was an error in saving the searchlog.");
    }
  });
  https
  .get(`https://www.googleapis.com/customsearch/v1?q=${keyword}&searchType=image&key=${process.env.GOOGLE_CUSTOM_SEARCH_KEY}&cx=${process.env.cx}&start=${offset}`, function (result) {
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
})
.get('/latest/imagesearch', function (req, res) {
  Searchlog.find({}, '-_id keyword date', function (err, searchlogs) {
    if (err) {
      console.log("Error finding latest searches.");
    } else {
      res.json(searchlogs);
    }
  });
});

module.exports = routes;
