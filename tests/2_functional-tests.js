const chai = require("chai")
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../server')
const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

chai.use(chaiHttp)

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {

        test('With solvable puzzle', function(done) {
          chai.request(server)
          .post('/api/solve')
          .send(
            {'puzzle': puzzleStrings[0][0]}
          )
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, {'solution': puzzleStrings[0][1]}, 'This was supoused to return a valid return')
            done()
          })
        })

        test('Without puzzle', function(done) {
          chai.request(server)
          .post('/api/solve')
          .send()
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, { error: 'Required field missing' }, 'This was supoused to return a missing error')
            done()
          })
        })

        test('With invalid characters', function(done) {
          chai.request(server)
          .post('/api/solve')
          .send({
            'puzzle': puzzleStrings[5][0]
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" }, 'This was supoused to return a invalid error')
            done()
          })
        })

        test('With less characters', function(done) {
          chai.request(server)
          .post('/api/solve')
          .send({
            'puzzle': puzzleStrings[6][0]
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" }, 'This was supoused to return a size error')
            done()
          })
        })

        test('Impossible to be solved', function(done) {
          chai.request(server)
          .post('/api/solve')
          .send({
            'puzzle': puzzleStrings[7][0]
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.deepEqual(res.body, { 'error': 'Puzzle cannot be solved' }, 'This was supoused to return a impossible error')
            done()
          })
        })

    })

    suite('POST /api/check', () => {
      test('Correct check', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': '7',
          'coordinate': 'a1'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "valid": true }, 'This was supoused to return a valid return')
          done()
        })
      })

      test('1 conflict', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': '4',
          'coordinate': 'b5'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "valid": false, "conflict": [ "column" ] }, 'This was supoused to return unique conflict error')
          done()
        })
      })

      test('Many conflicts', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': '1',
          'coordinate': 'h2'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "region" ] }, 'This was supoused to return 2 conflicts errors')
          done()
        })
      })

      test('Everithing conflicts', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': '4',
          'coordinate': 'e9'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "valid": false, "conflict": [ "row", "column", "region" ] }, 'This was supoused to return 3 conflicts errors')
          done()
        })
      })

      test('Without important thing', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'coordinate': 'e9'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { 'error': 'Required field(s) missing' }, 'This was supoused to return a missing error')
          done()
        })
      })

      test('With invalid characters', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[5][0],
          'value': '1',
          'coordinate': 'a1'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "error": "Invalid characters in puzzle" }, 'This was supoused to return a invalid error')
          done()
        })
      })

      test('With less characters', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[6][0],
          'value': '1',
          'coordinate': 'a1'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "error": "Expected puzzle to be 81 characters long" }, 'This was supoused to return a less error')
          done()
        })
      })

      test('With invalid coodinate', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': '1',
          'coordinate': 'z9'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "error": "Invalid coordinate" }, 'This was supoused to return a invalid coordinate error')
          done()
        })
      })

      test('With invalid coodinate', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
          'puzzle': puzzleStrings[0][0],
          'value': 'x',
          'coordinate': 'a9'
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, { "error": "Invalid value" }, 'This was supoused to return a invalid value error')
          done()
        })
      })
    })
})

