import React from 'react';
// import dayjs from 'dayjs';
import { Button, Typography, TextField, Card, CardContent, Grid, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AuthContext from '../../context/AuthContext.jsx';
import * as request from '../../utils/request.jsx';

function Panel ({ listingObject, selectedDateRange }) {
  const [payload, setPayload] = React.useState(null);
  const [startDate, setStartDate] = React.useState(selectedDateRange.startDate ? new Date(selectedDateRange.startDate) : null);
  const [endDate, setEndDate] = React.useState(selectedDateRange.endDate ? new Date(selectedDateRange.endDate) : null);
  const [totalPrice, setTotalPrice] = React.useState(listingObject.price);
  const [nNights, setNNights] = React.useState(1);
  const { user } = React.useContext(AuthContext);
  const isInitialMount = React.useRef(true);
  // console.log(user.userId, listingObject.owner);
  const handleDateChange = (isStartDate, value) => {
    if (isStartDate) {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleReserve = (startDate, endDate, price) => {
    console.log(startDate, endDate);
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const difference = end - start;
      if (difference >= 0) {
        const payload = {
          dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
          totalPrice: price
        };
        setPayload(payload);
      }
    }
  }

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // Set to false on the first render
    } else {
      const postBooking = async () => {
        try {
          if (user) {
            await request.createNewBooking(listingObject.id, payload);
            location.reload(true);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
      postBooking();
    }
  }, [payload])

  const isDateInRange = (date, range) => {
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    return date >= startDate && date <= endDate;
  };

  React.useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const difference = end - start;
      // Convert milliseconds to days
      let days = Math.max(0, difference / (1000 * 60 * 60 * 24)); // Ensure days is not negative
      if (days === 0) days = 1;
      console.log(days); // Output the number of days
      setNNights(days); // Store the number of nights in state
    }
  }, [startDate, endDate]);

  React.useEffect(() => {
    const total = nNights * listingObject.price;
    setTotalPrice(total);
  }, [nNights]);

  const isDateInAnyRange = (date) => {
    return listingObject.availability.some(range => isDateInRange(date, range));
  };

  return (
    <Card sx={{ minWidth: '400px', margin: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h6">
          ${totalPrice} AUD total
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} justifyContent="center" sx={{ my: 1 }}> {/* Center items horizontally */}
            <Grid item>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(val) => handleDateChange(true, val)}
                shouldDisableDate={(date) => !isDateInAnyRange(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(val) => handleDateChange(false, val)}
                shouldDisableDate={(date) => !isDateInAnyRange(date)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        { user && listingObject.owner !== user.userId && <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={() => handleReserve(startDate, endDate, totalPrice)}
        >
          Reserve
        </Button>}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            ${listingObject.price} x {nNights} nights
          </Typography>
          <Typography variant="h6">
            ${totalPrice} AUD
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Panel;
