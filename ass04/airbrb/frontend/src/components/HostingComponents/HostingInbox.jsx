import * as React from 'react';

import { getAllUserRelatedBookings } from '../../utils/request';
import { HostingInboxCompnent } from './HostingInboxComponent';
import { Box } from '@mui/material';
export const HostingInbox = () => {
  const [allPendingBookings, setAllPendingBookings] = React.useState([]);
  const [allAcceptBookings, setAllAcceptBookings] = React.useState([]);
  const [allRejectBookings, setAllRejectBookings] = React.useState([]);
  const [willUpdateComponent, setWillUpdateComponent] = React.useState(false);
  React.useEffect(async () => {
    const temp = await getAllUserRelatedBookings();
    console.log(temp);
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
      setWillUpdateComponent(false);
    }
    processState();
  }, [willUpdateComponent]);
  return (<Box>
    <Box>
      {allPendingBookings.map((obj, index) => <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent}/>)}
      {allAcceptBookings.map((obj, index) => <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent}/>)}
      {allRejectBookings.map((obj, index) => <HostingInboxCompnent key={index} bookingObject={obj} setWillUpdateComponent={setWillUpdateComponent}/>)}
    </Box>
  </Box>);
}
