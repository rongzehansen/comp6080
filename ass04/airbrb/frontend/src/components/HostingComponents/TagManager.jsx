import React from 'react';
import TvIcon from '@mui/icons-material/Tv';
import PoolIcon from '@mui/icons-material/Pool';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
export const tag = ['Wi-Fi', 'Air conditioning', 'TV', 'Pool'];

export const getIcon = (title) => {
  switch (title) {
    case 'Wi-Fi':
      return <WifiIcon />
    case 'Air conditioning':
      return <AcUnitIcon />
    case 'TV':
      return <TvIcon />
    case 'Pool':
      return <PoolIcon />
  }
  return <DisabledByDefaultIcon />
}
