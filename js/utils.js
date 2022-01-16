import { CELL_VALUE } from "./constants.js";
import { GAME_STATUS } from "./constants.js";
// Write a function to check status of tic-tac-toe game
// Ref: what is tic-tac-toe game: https://en.wikipedia.org/wiki/Tic-tac-toe
// In summary, tic-tac-toe game has 9 cells divided into 3 rows of 3 cells.
// Each cell can have 3 values: either X, O or empty.
// We say X is win if there are 3 'X' in either horizontal, vertical or diagonal row.
// The same to O.
// If 9 cells is full of values but no one win, then the game is ended.
//
// Given an array of 9 items: [a0, a1, ..., a7, a8] represent for the tic-tac-toe game cells value:
// |  a0  | a1  | a2  |
// |  a3  | a4  | a5  |
// |  a6  | a7  | a8  |
// Each item will receive either of 3 values: empty, X or O.
// Return an object includes two keys:
// - `status`: a string indicate status of the game. It can be one of the following values:
//    - 'X': if X is win
//    - `O`: if O is win
//    - 'END': if game is ended and no one win
//    - 'PLAYING': if no one is win and game is not ended yet.
//
// - `winPositions`:
//    - If X or O is win, return indexes of the 3 winning marks(X/O).
//    - Return empty array.
//
// Example:
// Input array: cellValues = ['X', 'O', 'O', 'O', 'X', 'X', 'X', 'O', 'O']; represent for
// |  X  | O  | O  |
// |     | X  |    |
// |     | O  | X  |

// |  X  | O  | O  |
// |   o | X  |  x  |
// |    x | O  | o  |
// -----
// ANSWER:
// {
//    status: 'X',
//    winPositions: [0, 4, 8],
// }
//

// Input: an array of 9 items
// Output: an object as mentioned above
export function checkGameStatus(cellValues) {
  // Write your code here ...
  // Please feel free to add more helper function if you want.
  // It's not required to write everything just in this function.
  const winIndexSetList = [
    //horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    //vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    //diagonal
    [0, 4, 8],
    [2, 4, 6]

  ]
  
  //win
  const winIndexSet = winIndexSetList.findIndex(set => {
    const first = cellValues[set[0]]
    const second = cellValues[set[1]]
    const third = cellValues[set[2]]
    
    return first !== '' && first === second && second === third;
  })
  if(winIndexSet >= 0 ){
    const winValueIndex = winIndexSetList[winIndexSet][0]
    const winValue = cellValues[winValueIndex]

    return {
      status: winValue === CELL_VALUE.CIRCLE ? GAME_STATUS.O_WIN : GAME_STATUS.X_WIN,
      winPositions: winIndexSetList[winIndexSet],
    }
  }
  
  //keep playing or end
  const isPlaying = cellValues.filter(x => x === '').length > 0 

  return {
    status: isPlaying ? GAME_STATUS.PLAYING : GAME_STATUS.ENDED,
    winPositions: [],
    };
}
