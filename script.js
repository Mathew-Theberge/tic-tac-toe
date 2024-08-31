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
        if (board.some( (row) => {
            if (row.every( (cell) => {
                return cell.getValue() === "X" || cell.getValue() === "O"
            })) {
                return true
            }
        })) {
            return true
        }
    }

    return {switchPlayerTurn, dropToken, activePlayer}
})()

console.log(Gameboard.board)
Gameboard.printBoard()
GameController.dropToken(GameController.activePlayer)

