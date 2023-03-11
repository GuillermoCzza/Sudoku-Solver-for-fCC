const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
        done();
      });
  });
  
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({puzzle: '1h5xqefd4..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({puzzle: '...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({puzzle: '1.1..1.11..11.11.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "A3", value: 9})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "B5", value: 8})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['row'])
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "B3", value: 9})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['column', 'region'])
        done();
      });
  });
  
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "A2", value: 5})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.equal(res.body.valid, false);
         assert.property(res.body, 'conflict');
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region'])
        done();
      });
  });
  
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: 'hf9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "A2", value: 5})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '9..5.1.85.4....', coordinate: "A2", value: 5})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "A15", value: 5})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });
  
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
    chai
      .request(server)
      .post('/api/check')
      .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: "A2", value: 'asdasd'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
  
});

