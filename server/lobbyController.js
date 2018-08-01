var MongoClient = require('mongodb').MongoClient;
var MongoURL;
var dbName;

var LobbyController = {};

LobbyController.init = function (url, db) {
  MongoURL = url;
  dbName = db;
};



module.exports = LobbyController;