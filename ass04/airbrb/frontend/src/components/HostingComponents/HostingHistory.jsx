import * as React from 'react';
import { getAllUserRelatedBookings, getListingbyId } from '../../utils/request';
import { HostingInboxCompnent } from './HostingInboxComponent';
import { Box, Card, Grid, Typography, Divider, Chip } from '@mui/material';
import dayjs from 'dayjs';
export const HostingHistory = ({ listingId }) => {
  const [currentListing, setCurrentListing] = React.useState(null);
  const [allPendingBookings, setAllPendingBookings] = React.useState([]);
  const [allAcceptBookings, setAllAcceptBookings] = React.useState([]);
  const [allRejectBookings, setAllRejectBookings] = React.useState([]);
  const [willUpdateComponent, setWillUpdateComponent] = React.useState(false);
  React.useEffect(() => {
    let isMounted = true;
    const initState = async () => {
      if (!isMounted) return;
      const listingObj = await getListingbyId(listingId);
      let temp = await getAllUserRelatedBookings();
      setCurrentListing(listingObj);
      temp = temp.filter(obj => { const temp = parseInt(obj.listingId); return temp === listingId });
      setCurrentListing(listingObj);
      const processState = () => {
        const temp1 = [];
        const temp2 = [];
        const temp3 = [];
        for (const i of temp) {
          if (i.status === 'pending') temp1.push(i);
          else if (i.status === 'accepted') temp2.push(i);
          else temp3.push(i);
        }
        setAllAcceptBookings(temp2);
        setAllPendingBookings(temp1);
        setAllRejectBookings(temp3);
      }
      processState();
      setWillUpdateComponent(false);
    }
    initState();
    return () => {
      isMounted = false;
    };
  }, [willUpdateComponent]);
  const totalDayBookedThisYear = () => {
    const thisYear = dayjs().year();
    const reg = allAcceptBookings.filter(obj => dayjs(obj.dateRange.start).year() === thisYear && dayjs(obj.dateRange.end).year() === thisYear);
    let res = 0;
    for (const i of reg) {
      res += dayjs(i.dateRange.end).diff(dayjs(i.dateRange.start), 'day');
    }
    return res;
  }
  const getProfit = () => {
    const days = totalDayBookedThisYear();
    return days * currentListing.price;
  }
  if (!currentListing) return <Box>Listing not found!</Box>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ padding: 2, marginBottom: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>Listing Overview</Typography>
          <Divider />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Booked Days This Year</Typography>
              <Chip label={`${totalDayBookedThisYear()} days`} color="primary" />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Total Profit This Year</Typography>
              <Chip label={`$${getProfit()}`} color="success" />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Created At</Typography>
              <Typography variant="body1">{dayjs(currentListing.metadata.createDate).format('DD/MM/YYYY')}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="subtitle1">Days been up online</Typography>
              <Typography variant="body1">{dayjs().diff(dayjs(currentListing.metadata.createDate), 'day')}</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">Pending Requests</Typography>
          <Divider />
          {
          allPendingBookings.length > 0
            ? (allPendingBookings.map((obj, index) => (
              <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent} />
              ))
              )
            : (
            <Typography>No pending requests</Typography>
              )}
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">Accepted Requests</Typography>
          <Divider />
          {
          allAcceptBookings.length > 0
            ? (allAcceptBookings.map((obj, index) => (
              <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent} />
              ))
              )
            : (
            <Typography>No pending requests</Typography>
              )}
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6">Declined Requests</Typography>
          <Divider />
          {
          allRejectBookings.length > 0
            ? (allRejectBookings.map((obj, index) => (
              <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent} />
              ))
              )
            : (
            <Typography>No pending requests</Typography>
              )}
        </Card>
      </Grid>
    </Grid>
  );
};
