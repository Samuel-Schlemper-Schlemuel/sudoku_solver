class SudokuSolver {

  columnNumber(letter){
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
      return {'valide': false, 'conflict': 'row'}
    }

    return {'valide': true}
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
      return {'valide': false, 'conflict': 'column'}
    }

    return {'valide': true}
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
      return {'valide': false, 'conflict': 'region'}
    }

    return {'valide': true}
  }

  checkPlacement(puzzleString, row, column, value) {
    row = this.columnNumber(row)
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
      if(!problems[i]['valide']){
        result.push(problems[i])
      }
    }

    if(result.length > 0){
      return result
    } else {
      return problems[0]
    }
  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

