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
    
    return {board}

    function Cell() {
        let value = 0;
        let color = null
      
        // Accept a player's token to change the value of the cell
        const addToken = (player) => {
          value = player;
        };
      
        // How we will retrieve the current value of this cell through closure
        const getValue = () => value;

        const addColor = (playerColor) => {
            color = playerColor
        }

        const getColor = () => color
      
        return {
          addToken,
          getValue,
          addColor,
          getColor
        };
      }
})()


const GameController = (function () {
    const playerOne = "Player One"
    const playerTwo = "Player Two"

    const players = [
        {
            name: playerOne,
            token: "X",
            color: null
        },

        {
            name: playerTwo,
            token: "O",
            color: null
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

    const dropToken = (row, column) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(activePlayer.token)
            board[row][column].addColor(activePlayer.color)
                if (!isGameWon()) {
                    if (isGameDrawn()) {
                        DisplayController.displayOutput("DRAW!")
                    } else {
                        switchPlayerTurn()

                    }
            } else {
                DisplayController.displayOutput(`${activePlayer.name} Won!`)
            }
        }
    }

    const isGameDrawn = () => {
        const availableCells = board.map((row) => row.map((cell) => cell.getValue())).flat()
        if (!availableCells.includes(0)) {return true}
    }

    isGameDrawn()

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

    return {dropToken, isGameWon, players}
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
                cellDisplay.addEventListener("click", () => {
                    if (!GameController.isGameWon()) {
                        GameController.dropToken(i, j)
                        cellDisplay.textContent = Gameboard.board[i][j].getValue()
                        cellDisplay.setAttribute("style", `color :${Gameboard.board[i][j].getColor()}`)
                    }
                })
                rowDisplay.append(cellDisplay)
            }
        }
    }
    createBoardDisplay()

    const outputText = document.querySelector(".outputText")

    const displayOutput = (message) => {
        outputText.textContent = message
    }

    // controls color change of buttons and players

    const player1ColorBtn = document.querySelector("#player1ColorBtn")
    const player2ColorBtn = document.querySelector("#player2ColorBtn")
    const player1ColorInput = document.querySelector("#player1ColorInput")
    const player2ColorInput = document.querySelector("#player2ColorInput")
    const startBtn = document.querySelector(".startBtn")

    player1ColorInput.addEventListener("change", () => {
        player1ColorBtn.setAttribute("style", `background: ${player1ColorInput.value}`)
    })

    player2ColorInput.addEventListener("change", () => {
        player2ColorBtn.setAttribute("style", `background: ${player2ColorInput.value}`)
    })

    const setPlayerColor = () => {
        GameController.players[0].color = player1ColorInput.value
        GameController.players[1].color = player2ColorInput.value
    }

    startBtn.addEventListener("click", setPlayerColor)

    return {displayOutput}
})()

// GameController.dropToken(GameController.activePlayer)

