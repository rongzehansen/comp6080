import React from 'react';
import AuthContext from '../../context/AuthContext.jsx';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as request from '../../utils/request.jsx';
import Typography from '@mui/material/Typography';

function History ({ listingObject }) {
  const { user } = React.useContext(AuthContext);
  const [bookings, setBookings] = React.useState(null);
  function formatISOToReadableDate (isoDateString) {
    const date = new Date(isoDateString);

    const readableDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${readableDate}`;
  }

  React.useEffect(() => {
    const checkBookings = async () => {
      try {
        if (user) {
          const bookings = await request.getAllBookings();
          const usersBookings = bookings.filter(booking => {
            return Number(booking.listingId) === Number(listingObject.id) && booking.owner === user.userId;
          });
          if (usersBookings.length > 0) {
            setBookings(usersBookings);
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    checkBookings();
  }, []);

  return (
    <>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Your bookings
      </Typography>
      <Box sx={{
        height: '300px', // Fixed height
        width: '100%', // Full width of the container
        overflowY: 'auto', // Vertical scrolling
        m: 2, // Margin for spacing
        bgcolor: 'background.paper', // Background color
        borderRadius: 1, // Rounded corners
        boxShadow: 1, // Shadow for depth
      }}>
        <List>
        {bookings && bookings.map((booking) => (
          <ListItem key={booking.id} divider>
            <ListItemText
              primary={`From ${formatISOToReadableDate(booking.dateRange.start)} to ${formatISOToReadableDate(booking.dateRange.end)}`}
              secondary={`Status: ${booking.status.toUpperCase()}`}
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        ))}
        </List>
      </Box>
    </>
  );
}

export default History;
