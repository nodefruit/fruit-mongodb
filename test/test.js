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

describe('Successfully selecting data', function () {
  var error     = false
    , result    = null
    , condition = {
        name    : 'khalid'
      , age     : 26
    };

  beforeEach(function (done) {
    adapter.find(collectionName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].name, condition.name);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(collectionName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 2);
  });

  it('should find 2 users with the same age', function () {
    assert.equal(result.length, 2);
    assert.equal(result[0].age, condition.age);
    assert.equal(result[1].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with an offset', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(collectionName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, null, 1);
  });

  it('should find 2 users with the same age starting from offset 1', function () {
    assert.equal(result.length, 2);
    assert.equal(result[0].age, condition.age);
    assert.equal(result[1].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit and offset', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(collectionName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 1, 1);
  });

  it('should find only one user with the same age starting from offset 1', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting one document', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.findOne(collectionName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find only one user', function () {
    assert.equal(result.age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting all data', function () {
  var error     = false
    , result    = null;

  beforeEach(function (done) {
    adapter.findAll(collectionName, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find all 5 inserted users', function () {
    assert.equal(result.length, 5);
    assert.equal(error, null);
  });
});

describe('successful count query', function () {
  var error     = false
    , result    = null
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.count(collectionName, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should count users with name khalid', function () {
    assert.equal(error, false);
    assert.equal(result, 1);
  });
});

describe('successful update query', function () {
  var error     = false
    , result    = null
    , data      = { name : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.update(collectionName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should update first user with name khalid', function () {
    assert.equal(error, false);
    assert.equal(result.result.success, true);
    assert.equal(result.result.count, 1);
    assert.equal(result.result.affectedCount, 1);
  });
});

describe('successful updateAll query', function () {
  var error     = false
    , result    = null
    , data      = { age : 50 }
    , condition = { age : 30 }

  beforeEach(function (done) {
    adapter.updateAll(collectionName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should update all users with age 30', function () {
    assert.equal(error, false);
    assert.equal(result.result.success, true);
    assert.equal(result.result.count, 3);
    assert.equal(result.result.affectedCount, 3);
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