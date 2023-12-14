const chai = require('chai');
const assert = chai.assert;
const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    suite('Logic puzzle', () => {
        test('Test valid puzzle', function(done) {
              assert.equal(solver.validate(puzzleStrings[0][0]), 'valid', 'This is a valid puzzle')
              done()
        })

        test('Test puzzle with invalid characters', function(done) {
            assert.deepEqual(solver.validate(puzzleStrings[5][0]), { "error": "Invalid characters in puzzle" }, 'This is a invalid puzzle')
            done()
        })

        test('Test puzzle with less characters', function(done) {
            assert.deepEqual(solver.validate(puzzleStrings[6][0]), { "error": "Expected puzzle to be 81 characters long" }, 'This is a invalid puzzle')
            done()
        })
    })

    suite('Logic line', () => {
        test('Test valid line', function(done) {
            assert.deepEqual(solver.checkRowPlacement(puzzleStrings[0][0], 1, 2, '3'), {'valid': true}, 'This is a valid row')
            done()
        })

        test('Test invalid line', function(done) {
            assert.deepEqual(solver.checkRowPlacement(puzzleStrings[0][0], 1, 2, '4'), {'valid': false, 'conflict': 'row'}, 'This is a invalid row')
            done()
        })
    })

    suite('Logic column', () => {
        test('Test valid column', function(done) {
            assert.deepEqual(solver.checkColPlacement(puzzleStrings[0][0], 9, 9, '8'), {'valid': true}, 'This is a valid column')
            done()
        })

        test('Test invalid column', function(done) {
            assert.deepEqual(solver.checkColPlacement(puzzleStrings[0][0], 9, 9, '7'), {'valid': false, 'conflict': 'column'}, 'This is a invalid column')
            done()
        })
    })

    suite('Logic region', () => {
        test('Test valid region', function(done) {
            assert.deepEqual(solver.checkRegionPlacement(puzzleStrings[0][0], 8, 5, '2'), {'valid': true}, 'This is a valid region')
            done()
        })

        test('Test invalid region', function(done) {
            assert.deepEqual(solver.checkRegionPlacement(puzzleStrings[0][0], 8, 5, '1'), {'valid': false, 'conflict': 'region'}, 'This is a invalid region')
            done()
        })
    })

    suite('Logic solve', () => {
        test('Test valid solve', function(done) {
            assert.deepEqual(solver.solve(puzzleStrings[0][0]), { 'solution': puzzleStrings[0][1] }, 'This is a valid solve')
            done()
        })

        test('Test invalid solve', function(done) {
            assert.deepEqual(solver.solve(puzzleStrings[5][0]),  { "error": "Invalid characters in puzzle" }, 'This is a invalid solve')
            done()
        })

        test('Test other valid solve', function(done) {
            assert.deepEqual(solver.solve(puzzleStrings[1][0]), { 'solution': puzzleStrings[1][1] }, 'This is a valid solve')
            done()
        })
    })
})
