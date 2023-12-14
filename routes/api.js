'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = function (app) {
  
  let solver = new SudokuSolver()

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let value = req.body.value
      let coordinate = req.body.coordinate

      if(puzzle == undefined || value == undefined || coordinate == undefined){
        return res.json({ error: 'Required field(s) missing' })
      }

      let validate = solver.validate(puzzle)

      if(validate != 'valid'){
        return res.json(validate)
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
      let puzzle = req.body.puzzle

      if(puzzle == undefined){
        return res.json({ error: 'Required field missing' })
      }

      return res.json(solver.solve(puzzle))
    })
}