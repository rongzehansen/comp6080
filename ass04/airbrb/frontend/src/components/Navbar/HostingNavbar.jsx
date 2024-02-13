import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { UserIcon } from '../User/UserIcon';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as AirbnbLogo } from '../../assets/svg/airbnb_logo.svg';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export const HostingNavbar = ({ selectComponent }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleRedirectListings = () => {
    handleCloseUserMenu();
    navigate('/listings');
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => { selectComponent('home'); navigate('/hosting'); }} >Your hosting</MenuItem>
              <MenuItem onClick={() => { selectComponent('inbox'); navigate('/hosting'); }}>
                <Typography textAlign="center">inbox</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => { navigate('/listings'); }}
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
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => { selectComponent('home'); navigate('/hosting'); }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
              Your hosting
              </Button>
              <Button
                onClick={() => { selectComponent('inbox'); navigate('/hosting'); }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
              inbox
              </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <UserIcon onClick={handleOpenUserMenu}/>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={ handleRedirectListings } >Home</MenuItem>
              <MenuItem onClick={async () => { handleCloseUserMenu(); navigate('/listings'); await logout(); }}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
