import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

const operators = ['+', '-', '*', '/', '%'];

export default function GameOnePage() {
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [operator, setOperator] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setFirstNumber(Math.floor(Math.random() * 50) + 1);
    setSecondNumber(Math.floor(Math.random() * 50) + 1);
    setOperator(operators[Math.floor(Math.random() * operators.length)]);
    setInput('');
  };

  const checkAnswer = () => {
    let answer;
    switch (operator) {
      case '+': answer = firstNumber + secondNumber; break;
      case '-': answer = firstNumber - secondNumber; break;
      case '*': answer = firstNumber * secondNumber; break;
      case '/': answer = firstNumber / secondNumber; break;
      case '%': answer = firstNumber % secondNumber; break;
      default: break;
    }

    if (parseFloat(input).toFixed(1) === answer.toFixed(1)) {
      alert('Congratulations');
      const gameRemaining = Number(localStorage.getItem('gamesRemaining'));
      const gameWon = Number(localStorage.getItem('gamesWon'));
      localStorage.setItem('gamesRemaining', JSON.stringify(gameRemaining - 1));
      localStorage.setItem('gamesWon', JSON.stringify(gameWon + 1));
      resetGame();
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#ccc">
        <Box display="flex" width="100%" height="100%" justifyContent="center" alignItems="center">
          {[firstNumber, operator, secondNumber, '=', ''].map((item, index) => (
            <Box key={index} width="20%" height="40%" display="flex" justifyContent="center" alignItems="center"
              style={{ background: 'linear-gradient(90deg, #abcabc, #cbacbd)', color: '#333' }}>
              {index === 4 ?
                <TextField size="small" value={input} onChange={e => setInput(e.target.value)} onKeyUp={checkAnswer} style={{ width: '50px' }} />
                : <Typography variant="h4">{item}</Typography>
              }
            </Box>
          ))}
        </Box>
      </Box>
      <Button onClick={resetGame} variant="outlined">Reset</Button>
      <Navbar />
    </Box>
  );
}
