const Player = (sign) => {
    this.sign = sign;
  
    const getSign = () => {
        return sign;
    };
  
    return {getSign};
};
  
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
  
    const setSquare = (index, sign) => {
        if (index > board.length) {
            return;
        }
        board[index] = sign;
    };
  
    const getSquare = (index) => {
        if (index > board.length) {
            return;
        }
        return board[index];
    };
  
    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };
  
    return {setSquare, getSquare, reset};
})();
  
const displayController = (() => {
    const squareElements = document.querySelectorAll(".square");
    const announceElement = document.getElementById("announcement");
    const restartButton = document.getElementById("restart");
  
    squareElements.forEach((square) =>
        square.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") {
                return;
            }
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );
  
    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setAnnouncement("Good luck!");
    });
  
    const updateGameboard = () => {
        for (let i = 0; i < squareElements.length; i++) {
            squareElements[i].textContent = gameBoard.getSquare(i);
        }
    };
  
    const setResult = (winner) => {
        if (winner === "Draw") {
            setAnnouncement("Draw!");
        } else {
            setAnnouncement(`${winner} has won!`);
        }
    };
  
    const setAnnouncement = (announcement) => {
        announceElement.textContent = announcement;
    };
  
    return {setResult, setAnnouncement};
})();
  
const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;
  
    const playRound = (squareIndex) => {
        gameBoard.setSquare(squareIndex, getCurrentPlayerSign());
        if (checkWinner(squareIndex)) {
            displayController.setResult(getCurrentPlayerSign());
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResult("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.setAnnouncement(`${getCurrentPlayerSign()}'s turn`);
    };
  
    const getCurrentPlayerSign = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
  
    const checkWinner = (squareIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
  
        return winConditions.filter((combination) => combination.includes(squareIndex)).some((possibleCombination) => possibleCombination.every((index) => gameBoard.getSquare(index) === getCurrentPlayerSign()));
    };
  
    const getIsOver = () => {
        return isOver;
    };
  
    const reset = () => {
        round = 1;
        isOver = false;
    };
  
    return {playRound, getIsOver, reset};
  })();