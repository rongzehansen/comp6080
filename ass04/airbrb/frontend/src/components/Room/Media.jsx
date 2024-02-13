import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Media ({ listingObject }) {
  const [currMedia, setCurrMedia] = React.useState(0);
  const nextMedia = () => {
    if (currMedia < listingObject.thumbnail.length - 1) {
      setCurrMedia(currMedia + 1);
    }
  }
  const prevMedia = () => {
    if (currMedia > 0) setCurrMedia(currMedia - 1);
  }
  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }
  const renderMedia = () => {
    const currThumbnail = listingObject.thumbnail[currMedia];
    if (isYouTubeVideo(currThumbnail)) {
      const autoplayUrl = currThumbnail.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1';
      return (
        <CardMedia
          component="iframe"
          height="450"
          image={autoplayUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      );
    } else {
      return (
        <CardMedia
          component="img"
          height="450"
          image={currThumbnail}
          alt={`Media ${currMedia + 1}`}
        />
      );
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {renderMedia()}
      <IconButton
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000
        }}
        onClick={prevMedia}
        disabled={currMedia === 0}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000
        }}
        onClick={nextMedia}
        disabled={currMedia === listingObject.thumbnail.length - 1}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
}

export default Media;
