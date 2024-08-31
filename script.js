const Gameboard = (function () {
    const rows = 3
    const columns = 3
    const board = []

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell())
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
      };
    
    return {board, printBoard}

    function Cell() {
        let value = 0;
      
        // Accept a player's token to change the value of the cell
        const addToken = (player) => {
          value = player;
        };
      
        // How we will retrieve the current value of this cell through closure
        const getValue = () => value;
      
        return {
          addToken,
          getValue
        };
      }
})()


const GameController = (function () {
    const playerOne = "Player One"
    const playerTwo = "Player Two"

    const players = [
        {
            name: playerOne,
            token: "X"
        },

        {
            name: playerTwo,
            token: "O"
        }
    ]
    const board = Gameboard.board

    let activePlayer = players[0]

    const switchPlayerTurn = () => {
        switch(activePlayer) {
            case players[0]:
                activePlayer = players[1]
                break
            case players[1]:
                activePlayer = players[0]
        }
    }

    const dropToken = (player) => {
        let userInputRow = prompt("pick row 1-3")
        let userInputColumn = prompt("pick column 1-3")
        if (board[userInputRow][userInputColumn].getValue() === 0) {
            board[userInputRow][userInputColumn].addToken(player.token)
            if (!isGameWon()) {
                switchPlayerTurn()
                Gameboard.printBoard()
                dropToken(activePlayer)
            } else {
                console.log(`${activePlayer.name} won`)
                Gameboard.printBoard()
            }
        }
    }

    const isGameWon = () => {

        function checkRow(array) {
            if (array.some( (row) => {
                if (row.every( (cell) => {
                    return cell.getValue() === "X"
                })) {
                    return true
                } else if (row.every( (cell) => {
                    return cell.getValue() === "O"
                })) {
                    return true
                }
            })) {
                return true
            }
        }

        // checks all rows for 3 of the same token
        if(checkRow(board)) {return true}

        // convert columns into rows so their compatable with checkrow function
        const columns = []

        for (let i = 0; i < board.length; i++) {
            columns[i] = []
            for (let j = 0; j < board.length; j++) {
                columns[i].push(board[j][i])
            }
        }

        if(checkRow(columns)) {return true}

        //  convert diagonal cells into arrays inside a main array
        // to create rows that can be looped through using checkrow function

        const diagonal = [[],[]]

        for (let i = 0; i < board.length; i++) {
            diagonal[0].push(board[i][i])
        }
        diagonal[1].push(board[2][0], board[1][1], board[0][2])

        if(checkRow(diagonal)) {return true}
    }

    return {switchPlayerTurn, dropToken, activePlayer}
})()

const DisplayController = (function () {

    const boardDisplay = document.querySelector(".board")

    const createBoardDisplay = () => {
        for (let i = 0; i < Gameboard.board.length; i++) {
            let rowDisplay = document.createElement("div")
            rowDisplay.classList.add("row")
            boardDisplay.append(rowDisplay)
            let row = Gameboard.board[i]
            for (let j = 0; j < Gameboard.board.length; j++) {
                let cellDisplay = document.createElement("button")
                cellDisplay.classList.add("cell")
                rowDisplay.append(cellDisplay)
            }
        }
    }

    return {createBoardDisplay}

})()

DisplayController.createBoardDisplay()
// GameController.dropToken(GameController.activePlayer)

