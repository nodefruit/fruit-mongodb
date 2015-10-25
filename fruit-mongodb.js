/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var MongoClient = require('mongodb').MongoClient
    , extend      = require('extend')
    , config      = {};
  
  function exec (callBack) {
    MongoClient.connect(config.url, function(err, db) {
      if(err) return callBack(err);
      callBack(null, db);
    });
  }
  
  function formatResult (rst, affectedKey, data) {
    var results = {
      result : {
          success       : !!rst.ok
        , count         : rst.n
        , affectedCount : rst[affectedKey] || rst.n
      }
    }
    return data ? extend(results, data) : results;
  }
  
  function dataManager () {
    
    this.type = 'mongodb';
    
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
              callBack(err, err ? null : formatResult(result.result, null, { 
                insertedIds : result.ops.map(function (item) { return item._id; })
              }));
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
          delete data._id;
          db.collection(collectionName)
            .updateOne(condition, { $set : data }, function (err, result) {
              db.close();
              callBack(err, err ? null : formatResult(result.result, 'nModified'));
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
          delete data._id;
          db.collection(collectionName)
            .update(condition, { $set : data }, { w:1, multi: true }, function (err, result) {
              db.close();
              callBack(err, err ? null : formatResult(result.result, 'nModified'));
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
 
    function del (one, collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName)
            [one ? 'deleteOne' : 'deleteMany'](condition, function (err, result) {
              db.close();
              callBack(err, err ? null : formatResult(result.result));
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      });
    }
    
    this.delete = function (collectionName, condition, callBack) {
      del(true, collectionName, condition, callBack);
    }
    
    this.deleteAll = function (collectionName, condition, callBack) {
      del(false, collectionName, condition, callBack);
    }
    
    this.count = function (collectionName, condition, callBack) {
      exec(function (err, db) {
        if(err) return callBack(err);
        try {
          db.collection(collectionName).count(condition, function (err, result) {
            db.close();
            callBack(err, result);
          });
        } catch (ex) {
          db.close();
          callBack(ex);
        }
      })
    }
  }
  
  return new dataManager;
  
}());