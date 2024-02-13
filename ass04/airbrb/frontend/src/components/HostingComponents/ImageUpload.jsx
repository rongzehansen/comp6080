import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { fileToDataUrl } from '../../utils/dataUrl';
import { ReactComponent as AddImageButton } from '../../assets/svg/add_image_button.svg';

export const ImageUploadCard = ({ setThumbnail, target }) => {
  const [imagePreviewUrls, setImagePreviewUrls] = useState(target);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    if (files.length) {
      const newImagePreviewUrls = await Promise.all(files.map(file => {
        return fileToDataUrl(file).then(dataUrl => { return dataUrl; })
      }));
      setImagePreviewUrls(prevImages => [...prevImages, ...newImagePreviewUrls]);
      setThumbnail(prevImages => [...prevImages, ...newImagePreviewUrls]);
    }
  };

  const handleDeleteImage = async (item) => {
    const newSelectedFiles = imagePreviewUrls.filter(obj => item !== obj);
    setImagePreviewUrls(newSelectedFiles);
    setThumbnail(prev => prev.filter(obj => item !== obj));
  };

  return (
    <div >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleImageChange}
      />
      <ImageList cols={3} rowHeight={170}>
      {imagePreviewUrls.map((item, index) => (
          <ImageListItem key={index} sx={{ width: '164px', height: '164px' }}>
            <img
              src={item}
              alt={`Uploaded ${index}`}
              loading="lazy"
            />
            <ImageListItemBar
              title={`Image: ${index + 1}`}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  onClick={() => handleDeleteImage(item)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            />
          </ImageListItem>
      ))}
       <ImageListItem sx={{ width: '164px', height: '164px' }}>
        <div>
          <label htmlFor="contained-button-file">
            <AddImageButton style={{ width: '164px', height: '164px' }}/>
          </label>
        </div>
       </ImageListItem>
      </ImageList>
    </div>
  );
};
