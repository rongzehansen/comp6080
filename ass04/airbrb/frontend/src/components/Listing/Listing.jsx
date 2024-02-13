import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Media from './Media.jsx';
import * as request from '../../utils/request.jsx';
import AuthContext from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Listing ({ listingObject, selectedDateRange }) {
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = React.useState(false);
  const { user } = React.useContext(AuthContext);
  const truncateStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`, { state: { selectedDateRange } });
  };

  React.useEffect(() => {
    const checkIfBooked = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
          const bookings = await request.getAllBookings();
          const usersBookings = bookings.filter(booking =>
            Number(booking.listingId) === Number(listingObject.id) && booking.owner === user.userId
          );
          if (usersBookings.length > 0) {
            setIsBooking(true);
          } else {
            setIsBooking(false);
          }
        } else {
          setIsBooking(false);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    checkIfBooked();
  }, [listingObject.id, user]);

  return (
    <Card sx={{ width: 345, position: 'relative' }}>
      {/* Status Indicator */}
      {isBooking && (
        <Typography
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: 'green',
            color: 'white',
            padding: '2px 8px',
            borderRadius: 1,
            zIndex: 1000
          }}>
          Your reservation
        </Typography>
      )}
      <CardActionArea>
        <Media listingObject={listingObject} />
        <div onClick={() => handleListingClick(listingObject.id)} key={listingObject.id}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" style={truncateStyle}>
            {listingObject.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" style={truncateStyle}>
            {listingObject.address.territory}, {listingObject.address.suburb}, {listingObject.address.detailAddress}, {listingObject.address.postcode}
          </Typography>
          <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
            {listingObject.reviews.length} Reviews
          </Typography>
        </CardContent>
        </div>
      </CardActionArea>
    </Card>
  );
}

export default Listing;
