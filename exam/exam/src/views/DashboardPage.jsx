import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

export default function DashboardPage () {
  const [gamesRemaining, setGamesRemaining] = useState(localStorage.getItem('gamesRemaining'));
  const [gamesWon, setGamesWon] = useState(localStorage.getItem('gamesWon'));
  
  useEffect(() => {
    const savedGameRemaining = localStorage.getItem('gamesRemaining');
    const savedGameWon = localStorage.getItem('gamesWon');
    
    if (savedGameRemaining) {
      setGamesRemaining(savedGameRemaining);
    } else {
      fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/remain.json')
        .then(response => response.json())
        .then(data => {
          console.log(data.score)
          if (data.score !== undefined) {
            setGamesRemaining(Math.max(0, data.score));
            localStorage.setItem('gamesRemaining', JSON.stringify(data.score));
          }
        })
        .catch(error => console.log(error));
    }
    if (!savedGameWon) {
      setGamesWon(0);
    }
  }, []);

  const handleReset = () => {
    localStorage.setItem('gamesRemaining', 5);
    localStorage.setItem('gamesWon', 0);
    setGamesRemaining(5);
    setGamesWon(0);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#ccc">
        <Grid container spacing={2} style={{ maxWidth: 600 }}>
          {['Games Remaining', 'Games Won', 'Keep Going/Great Job', 'Reset Button'].map((item, index) => (
            <Grid item xs={6} key={index} style={{ border: '1px solid #fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
              {item === 'Games Remaining' && <Typography variant="h6">Games Remaining: {gamesRemaining}</Typography>}
              {item === 'Games Won' && <Typography variant="h6">Games Won: {gamesWon}</Typography>}
              {item === 'Keep Going/Great Job' && <Typography variant="h6">{gamesRemaining > 0 ? "Keep going" : "Great job"}</Typography>}
              {item === 'Reset Button' && <Button variant="outlined" onClick={handleReset}>Reset</Button>}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Navbar />
    </Box>
  );
}
