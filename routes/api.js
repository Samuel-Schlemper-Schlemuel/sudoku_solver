'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = function (app) {
  
  let solver = new SudokuSolver()

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let validate = solver.validate(puzzle)

      if(validate != 'valid'){
        return res.json(validate)
      }

      let coordinate = req.body.coordinate
      let value = req.body.value

      if(value.length > 1){
        return res.json({ "error": "Invalid value" })
      }

      if(coordinate.length > 2){
        return res.json({ "error": "Invalid coordinate" })
      }

      let coordinateLetter = coordinate[0]
      let coordinateNumber = coordinate[1]

      return res.json(solver.checkPlacement(puzzle, coordinateLetter, coordinateNumber, value))
    })
    
  app.route('/api/solve')
    .post((req, res) => {
      return res.json({1: undefined})
    })
}