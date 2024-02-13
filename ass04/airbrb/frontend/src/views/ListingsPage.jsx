import * as React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Listing from '../components/Listing/Listing';
import Box from '@mui/material/Box';
import * as request from '../utils/request';
import AuthContext from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

function ListingsPage () {
  // const navigate = useNavigate();

  const [listings, setListings] = React.useState([]);
  const [selectedDateRange, setSelectedDateRange] = React.useState({ startDate: null, endDate: null });
  const { user } = React.useContext(AuthContext);
  const sortListingsByTitle = (listings) => {
    return listings.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
      return 0;
    });
  };
  /*
  const handleListingClick = (listingId) => {
    navigate(`/listings/${listingId}`, { state: { selectedDateRange } });
  };
  */
  React.useEffect(() => {
    const fetchListings = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const publishedListings = await request.getPublishedListings();
        let sortedListings = [];
        if (user) {
          const bookedListings = await request.getBookedListings(user.userId);
          const bookedListingIds = new Set(bookedListings.map(listing => Number(listing.id)));
          const otherListings = publishedListings.filter(listing => !bookedListingIds.has(Number(listing.id)));
          const sortedBookedListings = sortListingsByTitle(bookedListings);
          const sortedOtherListings = sortListingsByTitle(otherListings);
          sortedListings = sortedBookedListings.concat(sortedOtherListings);
        } else {
          sortedListings = sortListingsByTitle(publishedListings);
        }
        setListings(sortedListings);
      } catch (e) {
        console.error('Failed to fetch listings:', e);
      }
    };

    fetchListings();
  }, [user]);

  return (
    <>
      <Navbar setListings={setListings} setSelectedDateRange={setSelectedDateRange} selectedDateRange={selectedDateRange} />
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', mt: '20px' }}>
        {listings.map((listing) => (
          <Listing key={listing.id} listingObject={listing} selectedDateRange={selectedDateRange} />
        ))}
      </Box>
    </>
  );
}

export default ListingsPage;
