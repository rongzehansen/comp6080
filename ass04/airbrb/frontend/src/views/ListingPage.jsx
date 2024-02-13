import * as React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { useParams, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import * as request from '../utils/request.jsx';
import Box from '@mui/material/Box';
import Room from '../components/Room/Room.jsx';
import Panel from '../components/Room/Panel.jsx';
import History from '../components/Room/History.jsx'
import Reviews from '../components/Room/Reviews.jsx';

function ListingPage () {
  const location = useLocation();
  const { selectedDateRange } = location.state || {};
  const { listingId } = useParams();
  const { user } = React.useContext(AuthContext);
  const [listing, setListing] = React.useState({}); // State to store listing details

  React.useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const details = await request.getListingDetails(listingId);
        setListing(details);
        console.log(listing);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
    fetchListingDetails();
  }, [listingId, user]);

  return (
    <>
      <Navbar />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', // Centers horizontally
        overflow: 'auto', // Enables scrolling
      }}>
        {Object.keys(listing).length > 0 && <Room listingObject={listing} />}
        {Object.keys(listing).length > 0 && user && listing.owner !== user.userId && <History listingObject={listing} />}
        {Object.keys(listing).length > 0 && <Panel listingObject={listing} selectedDateRange={selectedDateRange} />}
        {Object.keys(listing).length > 0 && <Reviews listingObject={listing} />}
      </Box>
    </>
  );
}

export default ListingPage;
