class SudokuSolver {

  getRowNum(rowLetter){
    //rows will be 0 indexed
    const rows = "abcdefghi"
    return rows.indexOf(rowLetter.toLowerCase());
  }
  
  rowConvert(rowInput){
    if (typeof rowInput == "string"){
      return this.getRowNum(rowInput);  
    } else if (typeof rowInput != "number") {
      throw new Error("Unexpected row value: " + rowInput);
    }
    return rowInput;
  }
  
  validate(puzzleString) {
    if (puzzleString.length != 81){
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if(/[^\.|\d]/.test(puzzleString)){
      return { error: 'Invalid characters in puzzle' };
    }
    
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //I'll make it so rows and columns are 0-indexed
    column--; //columns real value in the code is 1 less than input or seen in the grid
    row = this.rowConvert(row);
    
    const coord = row * 9 + column;
    
    for (let i = row * 9; i - (row * 9) < 9; i++) {
      if (i != coord && value == puzzleString.charAt(i)){
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    //I'll make it so rows and columns are 0-indexed
    column--; //columns real value in the code is 1 less than input or seen in the grid
    row = this.rowConvert(row);
    const coord = row * 9 + column;
    
    for (let i = column; i < 81; i += 9){
      if (i != coord && value == puzzleString.charAt(i)){
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    //I'll make it so rows and columns are 0-indexed
    column--; //columns real value in the code is 1 less than input or seen in the grid
    row = this.rowConvert(row);
    const coord = row * 9 + column;
    //this time I have to check the 3 columns in 3 rows within the region
    //row and col should be 0, 3 or 6, as the ones at the beginning of each region
    row = Math.floor(row/3) * 3; 
    column = Math.floor(column/3) * 3;
   
    for (let i = row; i < row + 3; i++){
      for(let j = column; j < column + 3; j++){
        const currentIndex = i * 9 + j;
        if (currentIndex != coord && value == puzzleString.charAt(currentIndex)){
          return false;
        }
      }
    }
    return true;
    
  }

  //function to perform a full validity check with boolean output during solve
  okAtIndex(puzzleString, index, value){
    //if no num is given, checks the one that is already there
    if (!value){
      value = puzzleString.charAt(index);
    }
    const row = Math.floor(index/9);
    const column = (index % 9) + 1; //adding one because the checks subtract one
    
    if (this.checkRowPlacement(puzzleString, row, column, value) &&
        this.checkColPlacement(puzzleString, row, column, value) &&
        this.checkRegionPlacement(puzzleString, row, column, value))
    {
      return true;
    }
    return false;
  }


  //function that will be called recursively to solve the puzzle (backtracking algorithm)
  solve(puzzleString, firstWholeCheck = true) {
    if (firstWholeCheck){
      //check validity for initial puzzle state before solving
      for (let i = 0; i < 81; i++){
        if (puzzleString[i] != "." && !this.okAtIndex(puzzleString, i)){
          return null;
        }
      }
    }
    
    
    let index;
    let solved = true;
    //find an empty space in the puzzle. If no empty space is found,
    //that means it's solved
    for (index = 0; index < 81; index++) {
      if (puzzleString.charAt(index) === ".") {
        solved = false;
        break;
      } 
    }
    //if no "." was detected then it's solved (it's already been checked as a valid puzzle)
    if (solved){
      return puzzleString;
    }

    //try sequentially fitting 1 to 9 in the empty space
    for (let num = 1; num <= 9; num++) {
      if (this.okAtIndex(puzzleString, index, num)) {
        //if the number is valid I'll place it in the empty space
        let updatedPuzzle = puzzleString.substring(0, index) + num + puzzleString.substring(index + 1);
        
        //call this function recursively on the updated puzzle
        let result = this.solve(updatedPuzzle, false);
          
        if (result !== null) { //return puzzle if solved (will be null if not solved)
          return result;
        }
      }
    }
    return null; //backtrack if no number fit in the space 
  }

}

module.exports = SudokuSolver;

