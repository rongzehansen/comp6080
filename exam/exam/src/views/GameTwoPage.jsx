import { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

const gridSize = 10;
const emptyCell = null;
const player1 = 'blue';
const player2 = 'red';

const Cell = styled(Box)({
  width: '10%',
  height: '10%',
  border: '2px solid #333',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
});

const Circle = styled('div')(({ color }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const initialBoard = () => Array(gridSize).fill().map(() => Array(gridSize).fill(emptyCell));

export default function GameTwoPage() {
  const [board, setBoard] = useState(initialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [gameOver, setGameOver] = useState(false);
  const [winningMessage, setWinningMessage] = useState('');
  const [moveCount, setMoveCount] = useState(0);

  const addCoinToColumn = (columnIndex) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);
    for (let row = gridSize - 1; row >= 0; row--) {
      if (newBoard[row][columnIndex] === emptyCell) {
        newBoard[row][columnIndex] = currentPlayer;
        setBoard(newBoard);
        setMoveCount(moveCount + 1);
        checkForWin(newBoard, row, columnIndex);
        setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
        return;
      }
    }
  };

  const checkForWin = (board, row, column) => {
    const checkDirection = (dr, dc) => {
      let count = 0, r = row, c = column;
      const color = board[row][column];

      while (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c] === color) {
        count++;
        r += dr;
        c += dc;
      }
      return count;
    };

    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    for (let [dr, dc] of directions) {
      const count = checkDirection(dr, dc) + checkDirection(-dr, -dc) - 1;
      if (count >= 4) {
        setGameOver(true);
        setWinningMessage(`${currentPlayer === player1 ? 'Player 1' : 'Player 2'} wins`);
        if (currentPlayer === player1) {
          const gameRemaining = Number(localStorage.getItem('gamesRemaining'));
          const gameWon = Number(localStorage.getItem('gamesWon'));
          localStorage.setItem('gamesRemaining', JSON.stringify(gameRemaining - 1));
          localStorage.setItem('gamesWon', JSON.stringify(gameWon + 1));
        }
        return;
      }
    }

    if (!board.some(row => row.includes(emptyCell))) {
      setGameOver(true);
      setWinningMessage('No one wins');
    }
  };

  useEffect(() => {
    let interval;
    if (gameOver) {
      interval = setInterval(() => {
        document.querySelectorAll('.cell').forEach(cell => {
          cell.style.background = cell.style.background === 'rgb(204, 204, 204)' ? '#000' : '#ccc';
        });
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#ccc">
        <Box display="flex" flexWrap="wrap" width="400px" height="400px" position="relative">
          {gameOver && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '200px',
              bgcolor: '#fff',
              border: '1px solid #333',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              zIndex: 2,
            }}>
              <Typography variant="h6" sx={{ fontSize: '14pt' }}>{winningMessage}</Typography>
              <Typography>A total of {moveCount} moves were made</Typography>
            </Box>
          )}
          {board.map((row, rowIndex) => row.map((cell, columnIndex) => (
            <Cell key={`${rowIndex}-${columnIndex}`}
              className="cell"
              onClick={() => addCoinToColumn(columnIndex)}>
              {cell !== emptyCell && (
                <Circle color={cell === player1 ? player1 : player2} />
              )}
            </Cell>
          )))}
        </Box>
      </Box>
      <Navbar />
    </Box>
  );
}
