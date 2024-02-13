import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { red } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
export const BedRoomComponent = ({ indexId, saveCurrent, deleteCurrent }) => {
  const [type, setType] = useState('');
  const [typeError, setTypeError] = useState(null);
  const [bedNumber, setBedNumber] = useState(0);
  const [bedError, setBedError] = useState(null);
  const handleTypeChange = (event) => {
    setType(event.target.value);
  }
  const handleBedNumberChange = (event) => {
    setBedNumber(parseInt(event.target.value));
  }
  const handleSave = () => {
    let flag = true;
    if (type.trim().length === 0) {
      setTypeError('Type cannot be empty');
      flag = false;
    } else setTypeError(null);
    if (bedNumber <= 0) {
      setBedError('Invalid bed number');
      flag = false;
    } else setBedError(null);
    if (flag) {
      saveCurrent(indexId, type, bedNumber);
    }
  }
  const handleDelete = () => {
    deleteCurrent(indexId);
  }
  return (
    <Paper sx={{ padding: 2, backgroundColor: 'white', border: `1px solid ${red[200]}` }}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12}>
          <TextField
            error={Boolean(typeError)}
            fullWidth
            required
            label='Type'
            type='text'
            value={type}
            helperText={typeError}
            onChange={handleTypeChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={Boolean(bedError)}
            fullWidth
            required
            label='Bed Number'
            type='number'
            value={bedNumber}
            helperText={bedError}
            onChange={handleBedNumberChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
