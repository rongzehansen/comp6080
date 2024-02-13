import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Modal from '@mui/material/Modal';
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from '@mui/icons-material/Search';

// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as AirbnbLogo } from '../../assets/svg/airbnb_logo.svg';
import { RegisterComponent } from '../User/RegisterComponent';
import { UserIcon } from '../User/UserIcon';
import { LoginComponent } from '../User/LoginComponent';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Search from './Search';

/*
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: '40ch',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));
*/
function Navbar ({ setListings, setSelectedDateRange, selectedDateRange }) {
  const { user, logout } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [displayLoginModal, setDisplayLoginModal] = React.useState(false);
  const [displayRegisterModal, setDisplayRegisterModal] = React.useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLoginModalOpen = () => {
    handleMenuClose();
    setDisplayLoginModal(true);
    navigate('/listings/login');
  }

  const handleRedirectHosting = () => {
    handleMenuClose();
    navigate('/hosting');
  }

  const handleRedirectListings = () => {
    handleMenuClose();
    navigate('/listings');
  }

  const handleLoginModalClose = () => {
    setDisplayLoginModal(false);
    navigate('/listings');
  }

  const handleRegisterModalOpen = () => {
    handleMenuClose();
    setDisplayRegisterModal(true);
    navigate('/listings/register');
  }

  const handleRegisterModalClose = () => {
    setDisplayRegisterModal(false);
    navigate('/listings');
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    if (location.pathname === '/listings/login') {
      if (user) {
        handleLoginModalClose();
        return;
      }
      setDisplayLoginModal(true);
    } else setDisplayLoginModal(false);
    if (location.pathname === '/listings/register') {
      if (user) {
        handleRegisterModalClose();
        return;
      }
      setDisplayRegisterModal(true);
    } else setDisplayRegisterModal(false);
  }, [location, displayLoginModal, displayRegisterModal]);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={ handleRedirectListings } >Home</MenuItem>
      { !user && <div>
          <MenuItem onClick={handleLoginModalOpen}>
            <div>
              Login
            </div>
          </MenuItem>
          <MenuItem onClick={handleRegisterModalOpen}>
            <div>
              Sign up
            </div>
          </MenuItem>
        </div>
      }
      {user && <MenuItem onClick={ handleRedirectHosting } >Switch to hosting</MenuItem>}
      {user && <MenuItem onClick={async () => { await logout() }} >Log out</MenuItem>}
    </Menu>
  );
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <UserIcon onClick={handleProfileMenuOpen} />
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/listings"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <SvgIcon component={AirbnbLogo} inheritViewBox sx={{ mr: 1, width: 30, height: 32 }} />
            airbnb
          </Typography>
          {/* Spacer to balance the space on the left */}
          <Box sx={{ flexGrow: 1 }} />
          {location.pathname === '/listings' && <Search setListings={setListings} setSelectedDateRange={setSelectedDateRange} />}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <UserIcon onClick={handleProfileMenuOpen} />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
      {renderMobileMenu}
      {renderMenu}
      <Modal
          open={displayLoginModal}
          onClose={handleLoginModalClose}
          aria-labelledby="modal-user-login"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Welcome to Airbrb
            </Typography>
            <div >
              <LoginComponent closeModal={handleLoginModalClose}/>
            </div>
          </Box>
      </Modal>
      <Modal
          open={displayRegisterModal}
          onClose={handleRegisterModalClose}
          aria-labelledby="modal-user-login"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              Welcome to Airbrb
            </Typography>
            <div >
              <RegisterComponent closeModal={handleRegisterModalClose}/>
            </div>
          </Box>
      </Modal>
    </Box>
  );
}

export default Navbar;
