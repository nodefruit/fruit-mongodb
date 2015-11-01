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