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
        db.close();
        callBack(err);
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
        try {
          db.collection(collectionName)
            .insert(data, function (err, result) {
              db.close();
              callBack(err, result);
          });
        } catch(ex) {
          db.close();
          callBack(ex);
        }
      });
      return this;
    }
    
    this.findAll = function (collectionName, callBack) {
      this.find(collectionName, {}, callBack);
    }
    
    this.find = function (collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .find(condition)
            .toArray(function(err, result) {
              db.close();
              callBack(err, result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }    
    
    this.findOne = function (collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .findOne(condition, function(err, result) {
              db.close();
              callBack(err, result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
    
    this.update = function (collectionName, data, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .updateOne(condition, { $set : data }, function (err, result) {
              db.close();
              callBack(err, result.result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
    
    this.updateAll = function (collectionName, data, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .update(condition, { $set : data }, { w:1, multi: true }, function (err, result) {
              db.close();
              callBack(err, result.result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
 
    this.delete = function (collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .deleteOne(condition, function (err, result) {
              db.close();
              callBack(err, result.result);
          })
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
    
    this.deleteAll = function (collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            .deleteMany(condition, function (err, result) {
              db.close();
              callBack(err, result.result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
  }
  
  return new dataManager;
  
}());