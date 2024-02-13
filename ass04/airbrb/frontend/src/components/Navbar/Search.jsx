import React, { useState } from 'react';
import { TextField, Slider, FormControl, InputLabel, Select, MenuItem, Button, ButtonGroup, Box, Popover, IconButton, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import * as request from '../../utils/request.jsx';

function Search ({ setListings, setSelectedDateRange }) {
  const isInitialMount = React.useRef(true);
  const [filter, setFilter] = useState({
    searchTerms: [],
    bedrooms: {},
    dateRange: {},
    priceRange: {},
    reviewRating: 'highest'
  });
  const [searchTerms, setSearchTerms] = useState('');
  const [visiblePopover, setVisiblePopover] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [visibleSection, setVisibleSection] = useState(null);
  const [bedrooms, setBedrooms] = useState({ min: 1, max: 100 });
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [reviewRating, setReviewRating] = useState('highest');

  const sortListingsByTitle = (listings) => {
    return listings.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return -1;
      if (titleA > titleB) return 1;
      return 0;
    });
  };

  async function sortListingsByRatingDecending (listings) {
    // Fetch ratings for each listing
    const listingsWithRatings = await Promise.all(listings.map(async (listing) => {
      const rating = await request.getListingRating(listing.id);
      return { ...listing, rating }; // Combine the listing with its rating
    }));

    // Sort listings based on rating
    return listingsWithRatings.sort((a, b) => {
      const ratingA = a.rating;
      const ratingB = b.rating;
      return ratingB - ratingA; // Assuming higher ratings should come first
    });
  }

  async function sortListingsByRatingAscending (listings) {
    // Fetch ratings for each listing
    const listingsWithRatings = await Promise.all(listings.map(async (listing) => {
      const rating = await request.getListingRating(listing.id);
      return { ...listing, rating }; // Combine the listing with its rating
    }));

    // Sort listings based on rating in ascending order
    return listingsWithRatings.sort((a, b) => {
      const ratingA = a.rating;
      const ratingB = b.rating;
      return ratingA - ratingB; // Lower ratings first
    });
  }

  React.useEffect(() => {
    console.log(filter);
    const fetchListings = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const filteredListings = await request.getFilteredListings(filter);
        let sortedListings = [];
        if (user) {
          let bookedListings = await request.getBookedListings(user.userId);
          const bookedListingIds = new Set(bookedListings.map(listing => Number(listing.id)));
          const filteredListingIds = new Set(filteredListings.map(listing => Number(listing.id)));
          const otherListings = filteredListings.filter(listing => !bookedListingIds.has(Number(listing.id)));
          bookedListings = bookedListings.filter(listing => filteredListingIds.has(Number(listing.id)));
          let sortedOtherListings = null;
          let sortedBookedListings = null;
          if (reviewRating === 'highest') {
            sortedOtherListings = await sortListingsByRatingDecending(otherListings);
            sortedBookedListings = await sortListingsByRatingDecending(bookedListings);
          } else if (reviewRating === 'lowest') {
            sortedOtherListings = await sortListingsByRatingAscending(otherListings);
            sortedBookedListings = await sortListingsByRatingAscending(bookedListings);
          } else {
            sortedOtherListings = sortListingsByTitle(otherListings);
            sortedBookedListings = sortListingsByTitle(bookedListings);
          }
          sortedListings = sortedBookedListings.concat(sortedOtherListings);
        } else {
          if (reviewRating === 'highest') {
            sortedListings = await sortListingsByRatingDecending(filteredListings);
          } else if (reviewRating === 'lowest') {
            sortedListings = await sortListingsByRatingAscending(filteredListings);
          } else {
            sortedListings = sortListingsByTitle(filteredListings);
          }
        }
        setListings(sortedListings);
        console.log(sortedListings);
      } catch (e) {
        console.error('Failed to fetch filtered listings:', e);
      }
    };
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchListings();
    }
  }, [filter]);

  const handleSearchTerms = (e) => {
    setSearchTerms(e.target.value);
  };

  const handleClick = (event, popoverId) => {
    setAnchorEl(event.currentTarget);
    setVisiblePopover(popoverId);
  };

  const handleClose = () => {
    setVisiblePopover(null);
    setAnchorEl(null);
  };

  const handleSeach = () => {
    const filter = {
      searchTerms: [],
      bedrooms: {},
      dateRange: {},
      priceRange: {},
      reviewRating: 'highest'
    };
    if (searchTerms) {
      const words = searchTerms.toLowerCase().split(',').map(word => word.trim()).filter(word => word !== '');
      filter.searchTerms = words;
    }
    filter.bedrooms = bedrooms;
    if (dateRange.startDate !== null && dateRange.endDate !== null) {
      const date1 = new Date(dateRange.startDate);
      const date2 = new Date(dateRange.endDate);
      if (date1.getTime() <= date2.getTime()) {
        filter.dateRange = { startDate: date1.toISOString(), endDate: date2.toISOString() };
        setSelectedDateRange(filter.dateRange);
      }
    }
    filter.priceRange = priceRange;
    filter.reviewRating = reviewRating;
    // console.log(reviewRating);
    setFilter(filter);
  }

  const popoverStyles = {
    popoverContent: {
      padding: 2,
      minWidth: 250, // Set a minimum width for the popover content
    },
    submitButton: {
      marginTop: 2,
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <IconButton aria-label="Anywhere" onClick={(e) => handleClick(e, 'search')}>
            <PlaceIcon />
          </IconButton>
          <IconButton aria-label="Bedrooms" onClick={(e) => handleClick(e, 'bedrooms')}>
            <HotelIcon />
          </IconButton>
          <IconButton aria-label="Any week" onClick={(e) => handleClick(e, 'dateRange')}>
            <CalendarMonthIcon />
          </IconButton>
          <IconButton aria-label="Any week" onClick={(e) => handleClick(e, 'priceRange')}>
            <PriceChangeIcon />
          </IconButton>
          <IconButton aria-label="Any week" onClick={(e) => handleClick(e, 'reviewRating')}>
            <TrendingUpIcon />
          </IconButton>
          <Button startIcon={<SearchIcon />} onClick={handleSeach}>
            Search
          </Button>
        </ButtonGroup>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={popoverStyles.popoverContent}>
            {visiblePopover === 'search' && (
              <>
                <Typography gutterBottom>
                  Where to?
                </Typography>
                <TextField
                  value={searchTerms}
                  label="Comma separated string"
                  variant="outlined"
                  onChange={(e) => handleSearchTerms(e)}
                  fullWidth
                />
              </>
            )}

            {visiblePopover === 'bedrooms' && (
              <>
                <Typography gutterBottom>
                  How many bedrooms do you want?
                </Typography>
                <Slider
                  value={[bedrooms.min, bedrooms.max]}
                  onChange={(event, newValue) => setBedrooms({ min: newValue[0], max: newValue[1] })}
                  valueLabelDisplay="auto"
                  min={1}
                  max={100}
                />
              </>
            )}

            {visiblePopover === 'dateRange' && (
              <>
                <Typography gutterBottom>
                  When is your trip?
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box >
                    <DatePicker
                      label="Start Date"
                      value={dateRange.startDate}
                      onChange={(newValue) => setDateRange({ ...dateRange, startDate: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={(newValue) => setDateRange({ ...dateRange, endDate: newValue })}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Box>
                </LocalizationProvider>
              </>
            )}

            {visiblePopover === 'priceRange' && (
              <>
                <Typography gutterBottom>
                  What is your expected price range?
                </Typography>
                <Slider
                  value={[priceRange.min, priceRange.max]}
                  onChange={(event, newValue) => setPriceRange({ min: newValue[0], max: newValue[1] })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                />
              </>
            )}

            {visiblePopover === 'reviewRating' && (
              <>
                <Typography gutterBottom>
                  Sort listings by
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Review Rating</InputLabel>
                  <Select
                    value={reviewRating}
                    label="Review Rating"
                    onChange={(e) => setReviewRating(e.target.value)}
                  >
                    <MenuItem value="highest">Highest to Lowest</MenuItem>
                    <MenuItem value="lowest">Lowest to Highest</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}

export default Search;
