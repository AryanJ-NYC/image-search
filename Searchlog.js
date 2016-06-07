"use strict";
const Schema = require('mongoose').Schema,
      db = require('./database');

let searchlogSchema = new Schema({
  keyword : String,
  date: { type: Date, default: Date.now }
}, { capped: { size: 1024, max: 10 } });

let Searchlog = db.model('Searchlog', searchlogSchema);
module.exports = Searchlog;