var MongoClient = require('mongodb').MongoClient;
var MongoURL;
var dbName;

var UserController = {};

UserController.init = function (url, db) {
  MongoURL = url;
  dbName = db;
};

UserController.login = function (loginInfo, socket) {
  MongoClient.connect(MongoURL, function(err, client) {
    if (err) { console.log(err); }
    var users = client.db(dbName).collection("users");
    users.findOne({ username: loginInfo.username }, function (err, user) {
      if (err) { console.log(err); }
      if (user === null || user.password !== loginInfo.password) {
        return socket.emit('loginFailed');
      }
      users.update({ username: loginInfo.username }, { $set: { connected: true, address: socket, addressID: socket.id } })
      return socket.emit('loginSuccess');
    });
  })
}

UserController.logout = function (username) {
  MongoClient.connect(MongoURL, function (err, client) {
    if (err) { console.log(err); }
    var users = client.db(dbName).collection("users");
    users.update({ username: username }, { connected: false, address: null, addressID: null }, function (err) {
      if (err) { console.log(err); }
      client.close();
    });
  });
};

UserController.disconnect = function (connection) {
  MongoClient.connect(MongoURL, function (err, client) {
    if (err) { console.log(err); }
    var users = client.db(dbName).collection("users");
    users.update({ addressID: connection }, { connected: false, address: null, addressID: null }, function (err) {
      if (err) { console.log(err); }
      client.close();
    });
  });
};

UserController.createUser = function (accountInfo, socket) {
  MongoClient.connect(MongoURL, function (err, client) {
    if (err) { console.log(err); }
    var users = client.db(dbName).collection("users");
    users.findOne({ username: accountInfo.username }, function (err, user) {
      if (err) { console.log(err); }
      if (user !== null) {
        socket.emit('usernameTaken');
      } else {
        users.insert({ name: accountInfo.name, username: accountInfo.username, password: accountInfo.password, role: "USER", inGame: false, connected: false, game: null, address: null, addressID: null }, function (err, user) {
          if (err) { console.log("CREATION ERROR:", err); }
          client.close();
          socket.emit('accountCreated');
        });
      }
    });
  });
};

module.exports = UserController;