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
    let isFormSubmitted = false
    let isPlayingComputer = false

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
        if (GameController.isFormSubmitted) {
            if (GameController.isPlayingComputer) {

                function playComputerTurn () {
                    let computerRow = Math.floor(Math.random() * 3)
                    let computerColumn = Math.floor(Math.random() * 3)
                    if (board[computerRow][computerColumn].getValue() === 0) {
                        board[computerRow][computerColumn].addToken(activePlayer.token)
                        board[computerRow][computerColumn].addColor(activePlayer.color)
                        const cellDisplayValue = computerRow.toString() + computerColumn.toString()
                        const cellDisplay = document.querySelector(`.cell${cellDisplayValue}`)
                            if (!isGameWon()) {
                                if (isGameDrawn()) {
                                    DisplayController.displayOutput("DRAW!")
                                    cellDisplay.textContent = Gameboard.board[computerRow][computerColumn].getValue()
                                    cellDisplay.setAttribute("style", `color :${Gameboard.board[computerRow][computerColumn].getColor()}`)
                                } else {
                                    switchPlayerTurn()
                                    DisplayController.displayOutput(`It's ${activePlayer.name}'s Turn`)
                                    DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c`)
                                    cellDisplay.textContent = Gameboard.board[computerRow][computerColumn].getValue()
                                    cellDisplay.setAttribute("style", `color :${Gameboard.board[computerRow][computerColumn].getColor()}`)
                                }
                        } else {
                            DisplayController.displayOutput(`${activePlayer.name} Won!`)
                            DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c; border: black solid; border-width: 4px 0`)
                            cellDisplay.textContent = Gameboard.board[computerRow][computerColumn].getValue()
                            cellDisplay.setAttribute("style", `color :${Gameboard.board[computerRow][computerColumn].getColor()}`)
                        }
                    } else {
                        playComputerTurn()
                    }
                }

                if (activePlayer.name === "Computer") {
                    playComputerTurn()
                } else {
                    if (board[row][column].getValue() === 0) {
                        board[row][column].addToken(activePlayer.token)
                        board[row][column].addColor(activePlayer.color)
                            if (!isGameWon()) {
                                if (isGameDrawn()) {
                                    DisplayController.displayOutput("DRAW!")
                                } else {
                                    DisplayController.displayOutput(`It's ${activePlayer.name}'s Turn`)
                                    DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c`)
                                    switchPlayerTurn()
                                    playComputerTurn()
                                }
                        } else {
                            DisplayController.displayOutput(`${activePlayer.name} Won!`)
                            DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c; border: black solid; border-width: 4px 0`)
                        }
                    }
                }

            } else {
                if (board[row][column].getValue() === 0) {
                    board[row][column].addToken(activePlayer.token)
                    board[row][column].addColor(activePlayer.color)
                        if (!isGameWon()) {
                            if (isGameDrawn()) {
                                DisplayController.displayOutput("DRAW!")
                            } else {
                                switchPlayerTurn()
                                DisplayController.displayOutput(`It's ${activePlayer.name}'s Turn`)
                                DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c`)
                            }
                    } else {
                        DisplayController.displayOutput(`${activePlayer.name} Won!`)
                        DisplayController.outputText.setAttribute("style", ` background: ${activePlayer.color}9c; border: black solid; border-width: 4px 0`)
                    }
                }
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

    return {dropToken, isGameWon, players, isFormSubmitted}
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
                cellDisplay.classList.add("cell", `cell${i}${j}`)
                cellDisplay.addEventListener("click", () => {
                    if (!GameController.isGameWon()) {
                        if (GameController.isFormSubmitted) {
                            if (Gameboard.board[i][j].getValue() === 0) {
                                GameController.dropToken(i, j)
                                cellDisplay.textContent = Gameboard.board[i][j].getValue()
                                cellDisplay.setAttribute("style", `color :${Gameboard.board[i][j].getColor()}`)
                            }
                        }
                    }
                })
                rowDisplay.append(cellDisplay)
            }
        }
    }
    createBoardDisplay()

    const outputText = document.querySelector(".outputText")
    const resetBtn = document.querySelector(".resetBtn")

    resetBtn.addEventListener("click", () => {
        location.reload()
    })

    const displayOutput = (message) => {
        outputText.textContent = message
    }

    // controls color change of buttons and players

    const player1ColorBtn = document.querySelector("#player1ColorBtn")
    const player2ColorBtn = document.querySelector("#player2ColorBtn")
    const player1ColorInput = document.querySelector("#player1ColorInput")
    const player2ColorInput = document.querySelector("#player2ColorInput")

    player1ColorInput.addEventListener("change", () => {
        player1ColorBtn.setAttribute("style", `color: ${player1ColorInput.value}`)
    })

    player2ColorInput.addEventListener("change", () => {
        player2ColorBtn.setAttribute("style", `color: ${player2ColorInput.value}`)
    })

    const setPlayerColor = () => {
        GameController.players[0].color = player1ColorInput.value
        GameController.players[1].color = player2ColorInput.value
    }

    return {displayOutput, setPlayerColor, outputText}
})()


const formControls = (function () {

    const form = document.querySelector("#form")
    const plauer1Input = document.querySelector("#player1Input")
    const plauer2Input = document.querySelector("#player2Input")
    const inputList = document.querySelectorAll("input")

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        GameController.players[0].name = player1Input.value
        GameController.players[1].name = player2Input.value
        GameController.isFormSubmitted = true
        DisplayController.setPlayerColor()
        inputList.forEach( (input) => {
            input.setAttribute("disabled", "")
        })
        if (GameController.players[0].name === "" && GameController.players[1].name === "") {
            GameController.players[0].name = "Player One"
            GameController.players[1].name = "Player Two"
        } else if (GameController.players[0].name === "") {
            GameController.players[0].name = "Player One"
            GameController.players[1].name = player2Input.value
        } else if (GameController.players[1].name === "") {
            GameController.players[1].name = "Player Two"
            GameController.players[0].name = player1Input.value
        } else {
            GameController.players[0].name = player1Input.value
            GameController.players[1].name = player2Input.value
        }
    })

})()

const PlayComputer = (function () {

    const PlayComputerBtn = document.querySelector(".playComputer")
    const startBtn = document.querySelector(".startBtn")
    const inputList = document.querySelectorAll("input")
    const computerTurn = Math.floor(Math.random() * 2)


    const getComputerTurn = () => {
        if (computerTurn === 0) {
            if (GameController.players[0].name !== "") {
                GameController.players[1].name = player1Input.value
                GameController.players[0].name = "Computer"
            } else {
                GameController.players[0].name = "Computer"
                GameController.players[1].name = "Player Two"
            }
        } else {
                GameController.players[1].name = "Computer"
            if (GameController.players[0].name === "") {
                GameController.players[0].name = "Player One"
            }
        }
    }

    const getComputerChoice = () => {
        let computerRow = Math.floor(Math.random() * 3)
        let computerColumn = Math.floor(Math.random() * 3)

        return {computerRow, computerColumn}
    }

    PlayComputerBtn.addEventListener("click", () => {
        GameController.isPlayingComputer = true
        startBtn.removeAttribute("form")
        GameController.players[0].name = player1Input.value
        GameController.players[1].name = player2Input.value
        getComputerTurn()
        GameController.isFormSubmitted = true
        DisplayController.setPlayerColor()
        inputList.forEach( (input) => {
            input.setAttribute("disabled", "")
        })
        if (computerTurn === 0) {
            GameController.dropToken(null, null)
        }
    })

    return {computerTurn, getComputerChoice}

})()

// GameController.dropToken(GameController.activePlayer)


