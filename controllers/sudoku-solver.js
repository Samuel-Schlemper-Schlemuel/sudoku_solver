class SudokuSolver {

  rowNumber(letter){
    let number = letter.codePointAt()

    if(number < 10 || isNaN(number)){
      return 'Invalid'
    }

    return number >= 65 && number <= 90 ? number - 64 : number >= 97 && number <= 122 ? number - 96 : 'Invalid'
  }

  validateColumnRow(column, row){
    if(row == 'Invalid' || row > 9){
      return false
    } else if(column < 1 || column > 9 || isNaN(column)){
      return false
    } else {
      return true
    }
  }

  validate(puzzleString) {
    if(puzzleString.length != 81){
      return { "error": "Expected puzzle to be 81 characters long" }
    }

    let regDot = /[^\.]/g
    let notPoint = puzzleString.match(regDot)

    for(let i in notPoint){
      if(notPoint[i].match(/\D/) || notPoint[i].match(/0/)){
        return { "error": "Invalid characters in puzzle" }
      }
    }

    return 'valid'
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let data = puzzleString.substr((row - 1) * 9, 9)
    data = data.substring(0, column - 1) + data.substring(column)

    if(data.match(new RegExp(value, 'g'))){
      return {'valid': false, 'conflict': 'row'}
    }

    return {'valid': true}
  }

  checkColPlacement(puzzleString, row, column, value) {
    let data = ''
    let i = column - 1

    while(i < 81){
      data += puzzleString[i]
      i += 9
    }

    data = data.substring(0, row - 1) + data.substring(row)

    if(data.match(new RegExp(value, 'g'))){
      return {'valid': false, 'conflict': 'column'}
    }

    return {'valid': true}
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let data = ''
    
    let conversion1 = {
      1: 0,
      2: 0,
      3: 0,
      4: 3,
      5: 3,
      6: 3,
      7: 6,
      8: 6,
      9: 6
    }

    let conversion2 = {
      1: 0,
      2: 1,
      3: 2,
      4: 0,
      5: 1,
      6: 2,
      7: 0,
      8: 1,
      9: 2
    }

    for(let i = 0; i <= 2; i++){
      for(let c = 0; c <= 2; c++){
        let col = conversion1[column] + i
        let r = conversion1[row] + c
        data += puzzleString[col + r * 9]
      }
    }

    let position = conversion2[column] * 3 + conversion2[row]
    data = data.substring(0, position) + data.substring(position + 1)

    if(data.match(new RegExp(value, 'g'))){
      return {'valid': false, 'conflict': 'region'}
    }

    return {'valid': true}
  }

  checkPlacement(puzzleString, row, column, value) {
    row = this.rowNumber(row)
    column = Number.parseInt(column)
    value = Number.parseInt(value)

    if(value < 1 || value > 9 || isNaN(value)){
      return { "error": "Invalid value" }
    }

    if(!this.validateColumnRow(column, row)){
      return { "error": "Invalid coordinate" }
    }

    let problems = []
    problems.push(this.checkRowPlacement(puzzleString, row, column, value))
    problems.push(this.checkColPlacement(puzzleString, row, column, value))
    problems.push(this.checkRegionPlacement(puzzleString, row, column, value))
    let result = []

    for(let i in problems){
      if(!problems[i]['valid']){
        result.push(problems[i]['conflict'])
      }
    }

    if(result.length > 0){
      return {'valid': false, 'conflict': result}
    } else {
      return problems[0]
    }
  }

  toLetter(position){
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
    let indice = 0

    while(position > 9){
      indice++
      position -= 9
    }

    return letters[indice]
  }

  column(position){
    while(position > 9){
      position -= 9
    }

    return position
  }

  loop(puzzle, moreThan1Possibility = false){
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    let options = []
    let someChange = false

    if(moreThan1Possibility){
      let changed = false

      while(!changed){
        for(let i in puzzle){
          i = Number.parseInt(i)

          if(puzzle[i] == '.'){
            for(let n in numbers){
              n = Number.parseInt(n)

              if(this.checkPlacement(puzzle, this.toLetter(i + 1), this.column(i + 1), n + 1)['valid']){
                puzzle = puzzle.split('')
                puzzle[i] = n + 1
                puzzle = puzzle.join('')
                someChange = true 
                changed = true
                break
              }
            }

            if(changed){
              break
            }
          }
        }
      }
    }

    for(let i in puzzle){
      i = Number.parseInt(i)

      if(puzzle[i] == '.'){
        for(let n in numbers){
          n = Number.parseInt(n)

          if(this.checkPlacement(puzzle, this.toLetter(i + 1), this.column(i + 1), n + 1)['valid']){
            options.push(n + 1)
  
            if(options.length > 1){
              break
            }
          }
        }
  
        if(options.length == 0){
          return { error: 'Puzzle cannot be solved' }
        } else if(options.length == 1){
          puzzle = puzzle.split('')
          puzzle[i] = options[0]
          puzzle = puzzle.join('')
          someChange = true
        }

        options = []
      }

      if(i == 80 && !someChange){
        return 'more than 1 possibility'
      }
    }

    if(!puzzle.match(/\./g)){
      return {solution: puzzle}
    }

    if(someChange){
      return puzzle
    }
  }

  solve(puzzle) {
    let validate = this.validate(puzzle)

    if(validate != 'valid'){
      return validate
    }

    let result = undefined

    while(result == undefined){
      let loopResult = this.loop(puzzle, false)

      if(loopResult == 'more than 1 possibility'){
        loopResult = this.loop(puzzle, true)

        if(typeof loopResult == 'string'){
          puzzle = loopResult
        } else if (typeof loopResult == 'object'){
          result = loopResult
        }

      } else if(typeof loopResult == 'string'){
        puzzle = loopResult
      } else if (typeof loopResult == 'object'){
        result = loopResult
      }
    }

    return result
  }
}

module.exports = SudokuSolver;
