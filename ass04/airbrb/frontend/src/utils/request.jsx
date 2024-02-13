
import axios from 'axios';

const url = 'http://localhost:5005';

export const postRequest = async (fragment, data, token) => {
  const config = {
    headers: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(`${url}${fragment}`, data, config);
    return response;
  } catch (error) {
    console.error('Error with post request:', error);
    throw error;
  }
};

export const putRequest = async (fragment, data, token) => {
  const config = {
    headers: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.put(`${url}${fragment}`, data, config);
    return response;
  } catch (error) {
    console.error('Error with pust request:', error);
    throw error;
  }
};

export const getRequest = async (fragment, params = {}, token = null) => {
  const config = {
    params,
    headers: {},
  };
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(`${url}${fragment}`, config);
    return response;
  } catch (error) {
    console.error('Error with get request:', error);
    throw error;
  }
};

export const deleteRequest = async (fragment, params = {}, token) => {
  const config = {
    params,
    headers: {},
  };
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.delete(`${url}${fragment}`, config);
    return response;
  } catch (error) {
    console.error('Error with delete request:', error);
    throw error;
  }
};

export const getAllListings = async () => {
  try {
    const response = await getRequest('/listings', {}, null);
    return response.data.listings;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getAllBookings = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const response = await getRequest('/bookings', {}, user.token);
    return response.data.bookings;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getListingDetails = async (listingId) => {
  try {
    const response = await getRequest(`/listings/${listingId}`);
    response.data.listing.id = Number(listingId);
    console.log(response.data.listing);
    return response.data.listing;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getPublishedListings = async () => {
  try {
    const listings = await getAllListings();
    const listingsPromises = listings.map(obj =>
      getRequest('/listings/' + obj.id).then(response => ({
        ...response.data.listing,
        id: Number(obj.id)
      }))
    );
    let results = await Promise.all(listingsPromises);
    results = results.filter(listing => listing.published);
    return results;
  } catch (error) {
    console.error('Error fetching published listings:', error)
  }
  return null;
}

export const getBookedListings = async (userId) => {
  try {
    let bookings = await getAllBookings();
    const seenListingIds = new Set();
    bookings = bookings.filter(booking => {
      // Check if booking is by the user and if we have not seen this listingId before
      if (booking.owner === userId && !seenListingIds.has(booking.listingId)) {
        seenListingIds.add(booking.listingId);
        return true;
      }
      return false;
    });
    const bookingsPromises = bookings.map(obj =>
      getRequest('/listings/' + obj.listingId).then(response => ({
        ...response.data.listing,
        id: Number(obj.listingId)
      }))
    );
    const result = await Promise.all(bookingsPromises);
    return result;
  } catch (error) {
    console.error('Error fetching booked listings:', error)
  }
  return null;
}

export const getChosenListings = async (listings) => {
  try {
    const listingsPromises = listings.map(obj =>
      getRequest('/listings/' + obj.id).then(response => ({
        ...response.data.listing,
        id: Number(obj.id)
      }))
    );
    let results = await Promise.all(listingsPromises);
    results = results.filter(listing => listing.published);
    return results;
  } catch (error) {
    console.error('Error fetching published listings:', error)
  }
  return null;
}

export const getFilteredListings = async (filter) => {
  try {
    const startDate = new Date(filter.dateRange.startDate);
    const endDate = new Date(filter.dateRange.endDate);
    // console.log(startDate, endDate);
    const listings = await getAllListings();
    let result = [];
    const final = [];
    listings.forEach(listing => {
      const info = [];
      info.push(listing.title.toLowerCase());
      info.push(listing.address.territory.toLowerCase());
      info.push(listing.address.suburb.toLowerCase());
      info.push(listing.address.detailAddress.toLowerCase());
      info.push(listing.address.postcode.toLowerCase());
      const containsAll = filter.searchTerms.every(element => info.includes(element));
      if (containsAll) {
        result.push(listing);
      } else if (!filter.searchTerms) {
        result.push(listing);
      }
    });
    result = await getChosenListings(result);
    result.forEach(listing => {
      const nBedrooms = listing.metadata.bedroom.length;
      const price = Number(listing.price);
      const validNBedrooms = Number(filter.bedrooms.min) <= nBedrooms && Number(filter.bedrooms.max) >= nBedrooms;
      let validDateRange = true;
      if (Object.keys(filter.dateRange).length !== 0) {
        validDateRange = listing.availability.some(dateRange => {
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          return startDate.getTime() >= start.getTime() && endDate.getTime() <= end.getTime();
        })
      }
      // console.log(filter.dateRange);
      // console.log(validDateRange);
      const validPriceRange = price >= Number(filter.priceRange.min) && price <= Number(filter.priceRange.max);
      // TODO: rating
      if (validNBedrooms && validDateRange && validPriceRange) {
        final.push(listing);
      }
    });
    return final;
  } catch (error) {
    console.error('Error fetching booked listings:', error)
  }
  return null;
}

export const getListingRating = async (listingId) => {
  try {
    const details = await getListingDetails(listingId);
    const totalRating = details.reviews.reduce((accumulator, review) => {
      return accumulator + review.rating;
    }, 0);
    const overallRating = totalRating / details.reviews.length;
    console.log(overallRating);
    return overallRating;
  } catch (error) {
    console.error('Error getting the rating:', error)
  }
}

export const leaveAReview = async (listingId, bookingId, newReview) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest(`/listings/${listingId}/review/${bookingId}`, { review: newReview }, user.token);
    console.log(newReview);
  } catch (error) {
    console.error('Error leaving a review:', error)
  }
}

export const getUserDefinedListings = async (userId) => {
  try {
    let target = await getAllListings();
    target = target.filter(obj => obj.owner === userId);
    const targetPromises = target.map(obj =>
      getRequest('/listings/' + obj.id).then(response => ({
        ...response.data.listing,
        id: obj.id
      }))
    );
    const results = await Promise.all(targetPromises);
    return results;
  } catch (error) {
    console.error('Error fetching user defined listings:', error)
  }
  return null;
};

export const createNewListing = async (data) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await postRequest('/listings/new', data, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const createNewBooking = async (listingid, data) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const response = await postRequest(`/bookings/new/${listingid}`, data, user.token);
    return response.data.bookingId;
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const editListing = async (listingId, data) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest('/listings/' + listingId, data, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const publishListing = async (listingId, data) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest('/listings/publish/' + listingId, data, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}
export const unpublishListing = async (listingId) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest('/listings/unpublish/' + listingId, {}, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const deleteListing = async (listingId) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await deleteRequest('/listings/' + listingId, {}, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getAllUserRelatedBookings = async () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userDefinedListings = await getUserDefinedListings(user.userId);
    const allBookings = await getAllBookings();
    return allBookings.filter(tar => { const temp = parseInt(tar.listingId); return userDefinedListings.some(obj => obj.id === temp) });
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getSelectedListingBooking = async (listingId) => {
  try {
    const allBookings = await getAllBookings();
    return allBookings.filter(tar => { const temp = parseInt(tar.listingId); return listingId === temp });
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const acceptBooking = async (bookingId) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest('/bookings/accept/' + bookingId, {}, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const declinetBooking = async (bookingId) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await putRequest('/bookings/decline/' + bookingId, {}, user.token);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}

export const getListingbyId = async (listingId) => {
  try {
    return getRequest('/listings/' + listingId).then(response => ({
      ...response.data.listing,
      id: listingId
    })).catch(null);
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
    throw e;
  }
}
