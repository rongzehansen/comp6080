import * as React from 'react';
import { Box, Button, Card, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { acceptBooking, declinetBooking } from '../../utils/request';
import dayjs from 'dayjs';
export const HostingInboxCompnent = ({ bookingObject, setWillUpdateComponent }) => {
  const theme = useTheme();

  const handleAccept = async () => {
    await acceptBooking(bookingObject.id);
    setWillUpdateComponent(true);
  };

  const handleDecline = async () => {
    await declinetBooking(bookingObject.id);
    setWillUpdateComponent(true);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 2, padding: 2 }}>
      <Box>
        <Typography variant="subtitle1">{bookingObject.owner + '\'s'} booking</Typography>
        <Typography variant="body2">{dayjs(bookingObject.dateRange.start).format('DD/MM/YYYY')} - {dayjs(bookingObject.dateRange.end).format('DD/MM/YYYY')}</Typography>
        <Box>
        {dayjs(bookingObject.dateRange.end).diff(dayjs(bookingObject.dateRange.start), 'day')} days
      </Box>
      </Box>
      <Box>
        {bookingObject.status === 'pending' && (
          <>
            <Button variant="outlined" onClick={handleAccept} sx={{ marginRight: theme.spacing(1) }}>
              Accept
            </Button>
            <Button variant="outlined" color="error" onClick={handleDecline}>
              Reject
            </Button>
          </>
        )}
        {bookingObject.status === 'accepted' && (
          <Button variant="outlined" disabled startIcon={<CheckIcon />}>
            Accepted
          </Button>
        )}
        {bookingObject.status === 'declined' && (
          <Button variant="outlined" disabled startIcon={<CloseIcon />}>
            Declined
          </Button>
        )}
      </Box>
    </Card>
  );
};
