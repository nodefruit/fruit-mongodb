var assert          = require('assert')
  , adapter         = require('..')
  , config          = require('./testEnv')
  , collectionName  = 'collection_' + Math.random().toString(36).substring(7); // in case the database has some collections

describe('Connexion to the database', function () {
  var success = false;
  
  beforeEach(function (done) {
    adapter.connect(config, function (err) {
      success = !err;
      done();
    });
  });
  
  it('should get connected', function () {
    assert.equal(success, true);
  });
});

describe('Successfully inserting a document', function () {
  var results = {}
    , error   = null
    , data    = {
        name  : 'khalid'
      , age   : 26
    }

  beforeEach(function (done) {
    adapter.insert(collectionName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });

  it('should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 1);
    assert.equal(results.result.count, 1);
    assert.equal(results.insertedId.length, 1);
  });
});

describe('Successfully inserting many documents', function () {
  var results = {}
    , error   = null
    , data    = [
      { name  : 'Ahmed',    age   : 40 },
      { name  : 'Abdullah', age   : 30 },
      { name  : 'Omar',     age   : 30 },
      { name  : 'Othmane' , age   : 30 }
    ];

  beforeEach(function (done) {
    adapter.insert(collectionName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });

  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 4);
    assert.equal(results.result.count, 4);
    assert.equal(results.insertedId.length, 4);
  });
});

describe('Successfully drop the test collection', function () {
  var success       = false
    , mongoClient   = require('mongodb').MongoClient
    , confString  = 'mongodb://' + config.host + ':' + config.port + '/' + config.database;
  
  beforeEach(function (done) {
    mongoClient.connect(confString, function(err, db) {
      db.collection(collectionName).drop();
      success = success || !err;
      done();
    });
  });
  
  it('should drop the collection', function () {
    assert.equal(success, true);
  });
});