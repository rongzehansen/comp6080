import { useState, useEffect } from 'react';
import { AppBar, Box, Link, Toolbar, Typography, useMediaQuery } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as AirbnbLogo } from '../assets/airbnb_logo.svg';

export default function ExamplePage() {
  const isMediumScreen = useMediaQuery('(max-width:1400px)');
  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const getLinkText = (text) => {
    if (isSmallScreen) return text.substring(0, 2);
    if (isMediumScreen) return text.substring(0, 2);
    return text;
  };

  return (
    <AppBar position="static" sx={{ height: isSmallScreen ? 60 : isMediumScreen ? 80 : 100, bgcolor: '#333', border: '1px solid #fff', padding: '0 10%', justifyContent: 'center' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <SvgIcon component={AirbnbLogo} inheritViewBox sx={{ mr: 1, width: 20, height: 20 }} />
        <Link href="/dashboard" color="#fff">
          <Typography>{getLinkText('Dashboard')}</Typography>
        </Link>
        <Link href="/game/math" color="#fff">
          <Typography>{getLinkText('Math')}</Typography>
        </Link>
        <Link href="/game/connect" color="#fff">
          <Typography>{getLinkText('Connect 4')}</Typography>
        </Link>
        <Link href="/game/memory" color="#fff">
          <Typography>{getLinkText('Memorisation')}</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
