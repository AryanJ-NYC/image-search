"use strict";
const routes = require('express').Router(),
      https = require('https'),
      Searchlog = require('./Searchlog');

routes
.get('/api/imagesearch/:keyword', function (req, res) {
  let offset = req.query.offset || 1,
      keyword = req.params.keyword,
      searchlog = new Searchlog({ keyword: keyword });
  searchlog.save(function (err) {
    if (err) {
      console.error();
      res.json({ error: "There was an error in saving the searchlog." });
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
.get('/api/latest/imagesearch', function (req, res) {
  Searchlog.find({}, '-_id keyword date', function (err, searchlogs) {
    if (err) {
      console.error(err.message);
      res.json({ error: "There was an error searching the database" });
    } else {
      res.json(searchlogs);
    }
  });
})
.get('*', function (req, res) {
  let html = `
  <h1>Search for images</h1>
  <p>For any keyword you'd like to search, go to <code>http://${req.hostname}/api/imagesearch/keyword</code>
  </br>to view results in JSON format.</p>
  <p>To use an offset of 10, for example, end your request with <code>?offset=10</code>:
  </br><code>http://${req.hostname}/api/imagesearch/keyword?offset=10</code></p>
  <p>For the latest image searches, go to <code>http://${req.hostname}/api/latest/imagesearch</code>.</p>
  <p>View the code at my <a href="https://github.com/AryanJ-NYC/image-search">GitHub repo</a>.`;
  res.send(html);
});

module.exports = routes;
