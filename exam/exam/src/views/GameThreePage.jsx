import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar.jsx';

export default function GameThreePage() {
  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#ccc">
        
      </Box>
      <Navbar />
    </Box>
  );
}
