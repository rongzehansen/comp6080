import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export const BedroomView = ({ type, num }) => {
  return (
    <Card sx={{
      minWidth: 275,
      boxShadow: 3,
      mb: 2,
      backgroundColor: 'white',
      marginTop: '5px'
    }}>
      <CardContent sx={{ p: 1 }}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2">
              {type}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Bed number:
            </Typography>
            <Typography variant="body2">
              {num}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
