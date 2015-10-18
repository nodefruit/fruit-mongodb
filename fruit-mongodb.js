/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var MongoClient = require('mongodb').MongoClient
    , config      = {};
  
  function exec (callBack) {
    MongoClient.connect(config.url, function(err, db) {
      if(err) return callBack(err);
      callBack(null, db);
    });
  }
  
  function dataManager () {
    
    this.connect = function (conf, callBack) {
      config = conf;
      MongoClient.connect(conf.url, function(err, db) {
        callBack(err);
        db.close();
      });
      return this;
    }
    
    this.config = function (conf) {
      config = conf;
      return this;
    }
    
    this.insert = function (collectionName, data, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        db.collection(collectionName)
          .insert(data, function (err, result) {
            callBack(err, result);
            db.close();
        });
      });
      return this;
    }
    
  }
  
  return new dataManager;
  
}());