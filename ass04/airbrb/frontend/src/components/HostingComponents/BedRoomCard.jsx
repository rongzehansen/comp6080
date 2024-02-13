import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue } from '@mui/material/colors';
import Grid from '@mui/material/Grid';

export const BedroomCard = ({ indexId, type, num, deleteBedroom }) => {
  return (
    <Card sx={{
      minWidth: 275,
      boxShadow: 3,
      border: `1px solid ${blue[200]}`,
      mb: 2,
      p: 1
    }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2">
              {type}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Bed number:
            </Typography>
            <Typography variant="body2">
              {num}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={() => deleteBedroom(indexId)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
