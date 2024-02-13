import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Media from './Media.jsx';
import WifiIcon from '@mui/icons-material/Wifi';
import Button from '@mui/material/Button';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import PoolIcon from '@mui/icons-material/Pool';
import * as request from '../../utils/request.jsx';
import AuthContext from '../../context/AuthContext.jsx';
import StarIcon from '@mui/icons-material/Star';

function Room ({ listingObject }) {
  const [isBooking, setIsBooking] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  // const [bookingStatus, setBookingStatus] = React.useState('');
  const { user } = React.useContext(AuthContext);
  const nBedrooms = listingObject.metadata.bedroom.length;
  const nBathrooms = listingObject.metadata.bathroomNumber;
  const nBeds = listingObject.metadata.bedroom.reduce((total, bedroom) => {
    return total + bedroom.bedNum; // Replace 'beds' with the actual property name
  }, 0);

  React.useEffect(() => {
    const loadRating = async () => {
      console.log(true);
      try {
        const rating = await request.getListingRating(listingObject.id);
        console.log(rating);
        setRating(Number(rating).toFixed(2));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    loadRating();
  }, [listingObject.id, user])

  React.useEffect(() => {
    const checkIfBooked = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
          const bookings = await request.getAllBookings();
          const usersBookings = bookings.filter(booking => {
            return Number(booking.listingId) === Number(listingObject.id) && booking.owner === user.userId;
          });
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

  let haveWifi = false;
  let haveAC = false;
  let haveTV = false;
  let havePool = false;

  for (let i = 0; i < listingObject.metadata.amenities.length; i++) {
    if (listingObject.metadata.amenities[i] === 'TV') haveTV = true
    else if (listingObject.metadata.amenities[i] === 'Pool') havePool = true;
    else if (listingObject.metadata.amenities[i] === 'Air conditioning') haveAC = true;
    else haveWifi = true
  }

  const truncateStyle = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <>
      <Card sx={{ width: '95vw', position: 'relative' }}>
        {/* Status Indicator */}
        <CardActionArea>
          {isBooking && (
            <Typography
              sx={{
                backgroundColor: 'green',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 1,
                textAlign: 'center',
                zIndex: 1000
              }}>
              Your reservation
            </Typography>
          )}
          <CardHeader
            title={listingObject.title}
            subheader={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: 'gold', mr: 0.5, verticalAlign: 'middle' }} />
                <Typography variant="body" component="span">
                  {`${rating} . ${listingObject.reviews.length} Reviews . ${listingObject.address.territory}, ${listingObject.address.suburb}, ${listingObject.address.detailAddress}, ${listingObject.address.postcode}`}
                </Typography>
              </Box>
            }
          />
          <Media listingObject={listingObject} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" style={truncateStyle}>
              {`${listingObject.metadata.propertyType} hosted by ${listingObject.owner}`}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ marginTop: 1 }}>
              {`${nBedrooms} bedrooms . ${nBeds} beds . ${nBathrooms} baths`}
            </Typography>
            <Divider sx={{ my: 2 }}/>
            <Typography paragraph>
              {`${listingObject.metadata.description}`}
            </Typography>
            <Divider sx={{ my: 2 }}/>
            <Typography gutterBottom variant="h5" component="div" style={truncateStyle}>
              {'What this place offers'}
            </Typography>
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}>
              {haveWifi && <Button startIcon={<WifiIcon />}>
                Wi-Fi
              </Button>}
              {haveAC && <Button startIcon={<AcUnitIcon />}>
                AC
              </Button>}
              {haveTV && <Button startIcon={<TvIcon />}>
                TV
              </Button>}
              {havePool && <Button startIcon={<PoolIcon />}>
                Pool
              </Button>}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default Room;
