import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementList, getCurrentTurnElement, getCellElementAtIdx, getGameStatusElement, getReplayBtnElement, getUlElement} from "./selectors.js"
import { checkGameStatus } from "./utils.js"
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 * 
 */
function updateGameStatus(status){
    const statusElement = getGameStatusElement();
    if(statusElement) statusElement.innerText = status;
}

function showReplayBtn(){
    const replayBtn = getReplayBtnElement();
    if(replayBtn) replayBtn.classList.add('show')
}

function hideReplayBtn(){
    const replayBtn = getReplayBtnElement();
    if(replayBtn) replayBtn.classList.remove('show')
}

function highlightWinCells(winPositions){
    if(!Array.isArray(winPositions) || winPositions.length !== 3){
        throw new Error('Invalid win positions')
    }

    for ( const position of winPositions ){
        const cellElement = getCellElementAtIdx(position)
        cellElement.classList.add('win')
    }
}

function toggleTurn(){
    //toggle current turn
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    //update to current turn status on DOM
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS)
        currentTurnElement.classList.add(currentTurn)
    }
}
function handleCellClick(cellElement,index) {
    
   
    if(!cellElement) return;
    
    //check if is clicked => remove event
    const isChecked = cellElement.classList.contains(TURN.CIRCLE) || cellElement.classList.contains(TURN.CROSS);
    if(isChecked || gameStatus === GAME_STATUS.ENDED) return;

    //add cross or circle to element when click and assign it the cell-value
    cellElement.classList.add(currentTurn)

    //update values to cellValues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    //update game status
    const currentGameStatus = checkGameStatus(cellValues)
    switch (currentGameStatus.status) {
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN:{
            //update status
            gameStatus = GAME_STATUS.ENDED;
            updateGameStatus(currentGameStatus.status)
            //show replay btn
            showReplayBtn()
            //hightlight win cells
            highlightWinCells(currentGameStatus.winPositions)
            break;

        }
        case GAME_STATUS.ENDED:{
            //update status
            gameStatus = GAME_STATUS.ENDED;
            updateGameStatus(currentGameStatus.status)
            //show replay btn
            showReplayBtn()
            break;
        }
        default:{
            // keep playing
            gameStatus = GAME_STATUS.PLAYING;
            break;
        }
    }
    
    //toggle turn for next turn
    toggleTurn();

}

function initCellElementList(){
    //bind index for data-idx attribute for li
    const cellElementList = getCellElementList()
    if(!cellElementList) return;
    cellElementList.forEach((cellElement,index) => {
        cellElement.dataset.idx = index;
    })

    //bind events for ul
    const ulElement = getUlElement();
    console.log(ulElement)
    ulElement.addEventListener('click', (e) => {
        //get li element by e.target
        const liElement = e.target;
        if(liElement.tagName !== "LI") return;
        //get index by attribute data-idx
        const index = liElement.dataset.idx;
        handleCellClick(liElement,index)
    })
}
function resetGame(){
    //reset status and variables
    currentTurn = TURN.CROSS;
    cellValues = cellValues.map((x) => x = '');
    gameStatus = GAME_STATUS.PLAYING
    updateGameStatus(GAME_STATUS.PLAYING)
    //reset dom
    const cellElementList = getCellElementList()
    for (const cellElement of cellElementList) {
        cellElement.className = ""
    }

    //hide replay btn
    hideReplayBtn()
}
function initReplayBtn() {
    //get from DOM
    const replayBtn = getReplayBtnElement();
    if(replayBtn){
        replayBtn.addEventListener('click', resetGame )
    }
}
(() => {
    //bind click events for all cell elements
    initCellElementList()

    //bind events for replay btn
    initReplayBtn()
})()
