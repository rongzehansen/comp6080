import React from 'react';
import { Box, Typography, Card, CardContent, Divider, TextField, Button, Rating } from '@mui/material';
import AuthContext from '../../context/AuthContext.jsx';
import * as request from '../../utils/request.jsx';

function Reviews ({ listingObject }) {
  const [reviews, setReviews] = React.useState([]);
  const [review, setReview] = React.useState(null);
  const [newComment, setNewComment] = React.useState('');
  const [newRating, setNewRating] = React.useState(0);
  const [bookingId, setBookingId] = React.useState(0);
  const { user } = React.useContext(AuthContext);
  const isInitialMount = React.useRef(true);
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setNewRating(newValue);
  };

  const handleSubmitReview = () => {
    // Logic to submit the review
    const newReview = {
      postedOn: new Date().toISOString(),
      comment: newComment,
      rating: newRating,
      userId: user.userId
    }
    console.log(newReview);
    setReview(newReview)
    // Resetting the state
    setNewComment('');
    setNewRating(0);
  };

  React.useEffect(() => {
    const checkBookings = async () => {
      try {
        if (user) {
          const bookings = await request.getAllBookings();
          const usersBookings = bookings.filter(booking => {
            return Number(booking.listingId) === Number(listingObject.id) && booking.owner === user.userId && booking.status === 'accepted';
          });
          console.log(usersBookings);
          if (usersBookings.length > 0) {
            setBookingId(usersBookings[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    checkBookings();
  }, []);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // Set to false on the first render
    } else {
      const postReview = async () => {
        try {
          if (user && review.comment.trim() !== '') {
            await request.leaveAReview(listingObject.id, bookingId, review);
            location.reload(true);
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
      postReview();
    }
  }, [review])

  React.useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const details = await request.getListingDetails(listingObject.id);
        setReviews(details.reviews.reverse());
        console.log(details.reviews);
        console.log(reviews);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };
    fetchListingDetails();
  }, []);

  const formatDate = (isoDate) => new Date(isoDate).toLocaleString();

  return (
    <Box>
      {/* Review Input and Rating */}
      {user && listingObject.owner !== user.userId && bookingId !== 0 && <Box sx={{ minWidth: '95vw', mt: 2 }}>
        <Typography variant="h6">Leave a review</Typography>
        <TextField
          label="Add a comment..."
          multiline
          rows={4}
          value={newComment}
          onChange={handleCommentChange}
          variant="outlined"
          fullWidth
        />
        <Box>
          <Rating
            name="simple-controlled"
            value={newRating}
            onChange={handleRatingChange}
            precision={0.1}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmitReview}>
          Post
        </Button>
      </Box>}
      <Divider sx={{ my: 2 }} />
      {/* Displaying Comments */}
      <Typography variant="h6">{reviews.length} Reviews</Typography>
      {Object.keys(reviews).length !== 0 && reviews.map((review) => (
        <Card key={review.id} sx={{ mb: 2, minWidth: '95vw' }}>
          <CardContent>
            <Typography variant="subtitle2">{review.userId}</Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(review.postedOn)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={review.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>{review.rating}</Typography>
            </Box>
            <Typography variant="body1">{review.comment}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Reviews;
