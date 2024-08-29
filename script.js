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

console.log(Gameboard.board)

