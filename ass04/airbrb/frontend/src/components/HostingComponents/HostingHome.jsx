import * as React from 'react';
import AuthContext from '../../context/AuthContext';
import { getUserDefinedListings } from '../../utils/request';
import Typography from '@mui/material/Typography';
import { HostingCard } from './HostingCard';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CreateListingForm } from './CreateListingForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { PublishComponent } from './PublishComponent';
export const HostingHome = () => {
  const { user } = React.useContext(AuthContext);
  const [userListings, setUserListings] = React.useState([]);
  const [shouldUpdateListings, setShouldUpdateListings] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [currentSelectedListing, setCurrentSelectedListing] = React.useState(null);
  const [currentSelectedPublishListing, setCurrentSelectedPublishListing] = React.useState(null);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handlePublishOpen = (listingObj) => {
    setCurrentSelectedPublishListing(listingObj);
    setPublishOpen(true);
  }
  const handlePublishClose = () => {
    setPublishOpen(false);
    setCurrentSelectedPublishListing(null);
  }
  const handleEditOpen = (listingObj) => {
    setCurrentSelectedListing(listingObj);
    setOpenEdit(true);
    if (open) setOpen(false);
    navigate(`/hosting/listing/edit/${listingObj.id}`);
  }
  const handleEditClose = () => {
    setOpenEdit(false);
    navigate('/hosting');
    setCurrentSelectedListing(null);
  }
  const handleOpen = () => {
    setOpen(true);
    if (openEdit) setOpenEdit(false);
  }
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  React.useEffect(async () => {
    let isMounted = true;
    const fetchListings = async () => {
      if (!isMounted) return;
      try {
        const data = await getUserDefinedListings(user.userId);
        console.log(data);
        setUserListings(data);
        setShouldUpdateListings(false);
        return data;
      } catch (e) {
        console.error(e.message);
      }
      return null;
    };
    const target = await fetchListings();
    const path = location.pathname;
    if (path.startsWith('/hosting/listing/edit/')) {
      const listingId = parseInt(path.split('/hosting/listing/edit/')[1]);
      if (target) {
        const temp = target.find(obj => obj.id === listingId);
        if (temp) {
          setCurrentSelectedListing(temp);
          setOpenEdit(true);
          if (open) setOpen(false);
        }
      }
    }
    return () => {
      isMounted = false;
    };
  }, [shouldUpdateListings]);
  return (<Box>
    <Box>
      <Box id='hosting_header_title' sx={{ textAlign: 'center', marginTop: '100px' }}>
        <Typography gutterBottom sx={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
          Welcome, {user.userId}!
        </Typography>
        <Typography gutterBottom sx={{ fontSize: '1.3rem', color: 'rgb(160,160,160)', mb: 3 }}>
          Guests can reserve your place after you publish
        </Typography>
        <Button variant='contained' color='primary' onClick={handleOpen} startIcon={<AddCircleIcon />} sx={{ mt: 1 }}>
          Add New Listing
        </Button>
      </Box>
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-hosting-title"
      >
       <Typography id="create-hosting-title" variant="h6" component="h2">
        <Box sx={{ ...style }}>
            <CreateListingForm closeModal={handleClose} setShouldUpdateListings={setShouldUpdateListings} edit={false}/>
          </Box>
        </Typography>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="create-hosting-title"
      >
       <Typography id="create-hosting-title" variant="h6" component="h2">
        <Box sx={style}>
            <CreateListingForm closeModal={handleEditClose} setShouldUpdateListings={setShouldUpdateListings} listingObj={currentSelectedListing} edit={true}/>
          </Box>
        </Typography>
      </Modal>
      <Modal
        open={publishOpen}
        onClose={handlePublishClose}
        aria-labelledby="publish-modal"
      >
      <Typography id="create-hosting-title" variant="h6" component="h2">
        <Box sx={style}>
            <PublishComponent listingObject={currentSelectedPublishListing} handlePublishClose={handlePublishClose} setShouldUpdateListings={setShouldUpdateListings}/>
        </Box>
      </Typography>
      </Modal>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: '100px' }}>
      {userListings.map((obj, index) => (
        <Box key={index} sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' } }}>
          <HostingCard
            listingObject={obj}
            handleEditOpen={handleEditOpen}
            handlePublishOpen={() => handlePublishOpen(obj)}
            setShouldUpdateListings={setShouldUpdateListings}
          />
        </Box>
      ))}
    </Box>
  </Box>);
}
