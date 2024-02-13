import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircle';
export const YoutubeUpload = ({ setThumbnail, target }) => {
  const [videoPreviewUrls, setVideoPreviewUrls] = useState(target);
  const [videoLink, setVideoLink] = useState('');
  const [videoLinkError, setVideoLinkError] = useState(null);
  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value.trim());
  }
  function isYouTubeVideo (url) {
    const regex = /^(https?:\/\/)?(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&[^\s]+)?$/;
    return regex.test(url);
  }
  const handleVideoAdd = (e) => {
    e.preventDefault();
    if (videoLink !== '' && isYouTubeVideo(videoLink) && !videoPreviewUrls.some(obj => obj === videoLink)) {
      setVideoPreviewUrls(prevImages => [...prevImages, videoLink]);
      setThumbnail(prevImages => [...prevImages, videoLink]);
      setVideoLinkError(null);
    } else setVideoLinkError('Invalid Youtube video link');
    setVideoLink('');
  };

  const handleDeleteVideo = async (item) => {
    const newSelectedFiles = videoPreviewUrls.filter(obj => item !== obj);
    setVideoPreviewUrls(newSelectedFiles);
    setThumbnail(prev => prev.filter(obj => item !== obj));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
  <TextField
    error={Boolean(videoLinkError)}
    sx={{ marginBottom: '20px', width: '80%', backgroundColor: 'white', borderRadius: '4px' }}
    required
    id="youtube-link-ipt"
    label="YouTube Link"
    type="text"
    value={videoLink}
    helperText={videoLinkError}
    onChange={handleVideoLinkChange}
  />
  <Button
    variant="contained"
    color="primary"
    sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)', marginBottom: '20px' }}
    onClick={(e) => { handleVideoAdd(e) }}
    startIcon={<AddCircleOutlineIcon />}
  >
    Add Video
  </Button>
  <ImageList cols={3} rowHeight={170} sx={{ width: '100%' }}>
    {videoPreviewUrls.map((item, index) => (
      <ImageListItem key={index} sx={{ width: '164px', height: '164px', m: 1 }}>
        <iframe src={item.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'} title="YouTube video" style={{ width: '100%', height: '100%' }} />
        <ImageListItemBar
          title={`Video: ${index + 1}`}
          actionIcon={
            <IconButton
              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
              onClick={() => handleDeleteVideo(item)}
            >
              <DeleteIcon />
            </IconButton>
          }
        />
      </ImageListItem>
    ))}
  </ImageList>
</div>
  );
};
