import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ImageUploadCard } from './ImageUpload';
import { TageComponent } from './TagComponent';
import { BedRoomComponent } from './BedroomComponent';
import { createNewListing, editListing } from '../../utils/request';
import { BedroomCard } from './BedRoomCard';
import { YoutubeUpload } from './YoutubeUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { tag } from './TagManager';
import dayjs from 'dayjs';
export const CreateListingForm = ({ closeModal, setShouldUpdateListings, listingObj, edit }) => {
  const [title, setTitle] = useState(listingObj ? listingObj.title : '');
  const [description, setDescription] = useState(listingObj ? listingObj.metadata.description : '');
  const [type, setType] = useState(listingObj ? listingObj.metadata.propertyType : '');
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState(listingObj ? listingObj.price : 0);
  const [postcode, setPostcode] = useState(listingObj ? listingObj.address.postcode : '');
  const [suburb, setSuburb] = useState(listingObj ? listingObj.address.suburb : '');
  const [detailAddress, setDetailAddress] = useState(listingObj ? listingObj.address.detailAddress : '');
  const [territory, setTerritory] = useState(listingObj ? listingObj.address.territory : '');
  const [thumbnail, setThumbnail] = useState(listingObj ? listingObj.thumbnail : []);
  const [tags, setTags] = useState(listingObj ? listingObj.metadata.amenities : []);
  const [bathroomNumber, setBathroomNumber] = useState(listingObj ? listingObj.metadata.bathroomNumber : 0);
  const [bedroom, setBedroom] = useState(listingObj ? listingObj.metadata.bedroom : []);
  const [addBedroom, setAddBedroom] = useState([]);
  const [idIndex, setIdIndex] = useState(listingObj ? listingObj.metadata.bedroom.reduce((max, item) => (item.id > max.id ? item : max), listingObj.metadata.bedroom[0]).id : 0);

  const [titleError, setTitleError] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [postcodeError, setPostcodeError] = useState(null);
  const [suburbError, setSuburbError] = useState(null);
  const [detailAddressError, setDetailAddressError] = useState(null);
  const [territoryError, setTerritoryError] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [bathroomNumberError, setBathroomNumberError] = useState(null);
  const [bedroomError, setBedroomError] = useState(null);
  if (edit && !listingObj) {
    console.error('Edit is true but listingObj is empty');
    return;
  }
  const resetAll = () => {
    setTitle('');
    setDescription('');
    setType('')
    setPage(1);
    setPrice(0);
    setPostcode('');
    setSuburb('');
    setDetailAddress('');
    setTerritory('');
    setThumbnail([]);
    setTags([]);
    setBathroomNumber(0);
    setBedroom([]);
    setAddBedroom([]);
    setIdIndex(0);
  }
  const checkTitle = () => {
    if (title.trim().length === 0) {
      setTitleError('Title cannot be empty');
      return false;
    } else setTitleError(null);
    return true;
  }

  const checkType = () => {
    if (type.trim().length === 0) {
      setTypeError('Type cannot be empty');
      return false;
    } else setTypeError(null);
    return true;
  }

  const checkPrice = () => {
    if (!price || price <= 0) {
      setPriceError('Invalid price.');
      return false;
    } else setPriceError(null);
    return true;
  }

  const checkPostcode = () => {
    if (!postcode || !/^\d{4}$/.test(postcode)) {
      setPostcodeError('Invalid postcode');
      return false;
    } else setPostcodeError(null);
    return true;
  }

  const checkSuburb = () => {
    if (suburb.length === 0) {
      setSuburbError('Suburb cannot be empty');
      return false;
    } else setSuburbError(null);
    return true;
  }

  const checkDetailAddress = () => {
    if (detailAddress.trim().length === 0) {
      setDetailAddressError('Detail address cannot be empty');
      return false;
    } else setDetailAddressError(null);
    return true;
  }

  const checkTerritory = () => {
    if (territory.length === 0) {
      setTerritoryError('Territory address cannot be empty');
      return false;
    } else setTerritoryError(null);
    return true;
  }
  const checkThumbnail = () => {
    if (!thumbnail || thumbnail.length === 0) {
      setThumbnailError('Thumbnail cannot be empty');
      return false;
    } else setThumbnailError(null);
    return true;
  }

  const checkBathroomNumber = () => {
    if (bathroomNumber < 0) {
      setBathroomNumberError('Invalid bathroom number');
      return false;
    } else setBathroomNumberError(null);
    return true;
  }

  const checkBedroom = () => {
    if (!bedroom || bedroom.length === 0) {
      setBedroomError('Inavlid bedroom number');
      return false;
    } setBedroomError(null);
    return true;
  }

  const saveCurrent = (id, type, beds) => {
    setBedroom(currentBedrooms => [...currentBedrooms, { id, type, bedNum: beds, saved: true }]);
    setAddBedroom((currentAddBedrooms) => currentAddBedrooms.filter(obj => obj.props.indexId !== id));
  }
  const deleteCurrent = (id) => {
    setAddBedroom((currentAddBedrooms) => currentAddBedrooms.filter(obj => obj.props.indexId !== id));
  }

  const deleteBedroom = (id) => {
    setBedroom((currentBedrooms) => currentBedrooms.filter(obj => obj.id !== id));
  }

  const addNewBedroom = () => {
    setIdIndex(idIndex + 1);
    setAddBedroom([...addBedroom, <BedRoomComponent key = {idIndex + 1} indexId = {idIndex + 1} saveCurrent = {saveCurrent} deleteCurrent = {deleteCurrent}/>])
  }

  const handleBathroomNumberChange = (event) => {
    setBathroomNumber(parseInt(event.target.value))
  }

  const handleTerritoryChange = (event) => {
    setTerritory(event.target.value.trim());
  }

  const handleThumbnailChange = (target) => {
    setThumbnail(target);
  }
  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value.trim())
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(parseFloat(event.target.value));
  };

  const handleSuburbChange = (event) => {
    setSuburb(event.target.value.trim());
  };

  const handleDetailAddressChange = (event) => {
    setDetailAddress(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let flag = true;
    if (!checkTitle()) flag = false;
    if (!checkType()) flag = false;
    if (!checkPrice()) flag = false;
    if (!checkSuburb()) flag = false;
    if (!checkDetailAddress()) flag = false;
    if (!checkPostcode()) flag = false;
    if (!checkTerritory()) flag = false;
    if (!checkBathroomNumber()) flag = false;
    if (!checkBedroom()) flag = false;
    if (!checkThumbnail()) flag = false;
    if (flag) {
      const metadata = { amenities: tags, bathroomNumber, bedroom, propertyType: type, description, createDate: dayjs().toISOString() };
      const address = { territory, suburb, detailAddress, postcode };
      const data = {
        title,
        address,
        price,
        thumbnail,
        metadata
      };
      console.log(data);
      if (!edit) await createNewListing(data);
      else await editListing(listingObj.id, data);
      resetAll();
      closeModal();
      setShouldUpdateListings(true);
    }
    console.log('Submitting:', { title, price });
  };

  const nextPage = () => {
    let flag = true;
    switch (page) {
      case (1):
        if (!checkTitle()) flag = false;
        if (!checkType()) flag = false;
        if (!checkPrice()) flag = false;
        break;
      case (2):
        if (!checkSuburb()) flag = false;
        if (!checkDetailAddress()) flag = false;
        if (!checkPostcode()) flag = false;
        if (!checkTerritory()) flag = false;
        break;
      case (3):
        if (!checkBathroomNumber()) flag = false;
        if (!checkBedroom()) flag = false;
        break;
    }
    if (flag) setPage(page + 1);
  }

  const prevPage = () => {
    setPage(page - 1);
  }

  const selectCurrent = (target) => {
    setTags(currentTags => [...currentTags, target]);
  }

  const deselectCurrent = (target) => {
    setTags(currentTag => currentTag.filter(string => string !== target));
  }

  const firstPage = (<div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
  <h2 style={{ marginBottom: '20px' }}>Enter Property Details</h2>
  <TextField
    error={Boolean(titleError)}
    sx={{ marginBottom: '10px' }}
    required
    id="title"
    label="Title"
    type="text"
    value={title}
    helperText={titleError}
    onChange={handleTitleChange}
    fullWidth
  />
  <TextField
    error={Boolean(typeError)}
    sx={{ marginBottom: '10px' }}
    required
    id="type"
    label="Type"
    type="text"
    value={type}
    helperText={typeError}
    onChange={handleTypeChange}
    fullWidth
  />
  <TextField
    error={Boolean(typeError)}
    sx={{ marginBottom: '10px' }}
    required
    id="description"
    label="Description"
    type="text"
    value={description}
    onChange={handleDescriptionChange}
    fullWidth
  />
  <TextField
    error={Boolean(priceError)}
    sx={{ marginBottom: '20px' }}
    required
    id="price"
    label="Price"
    type="number"
    value={price}
    helperText={priceError}
    onChange={handlePriceChange}
    fullWidth
  />
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', width: '100%' }}>
    <Button
        type="button"
        variant="contained"
        color="primary"
        sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
        onClick={nextPage}
    >
        Next Page
    </Button>
  </div>
</div>
  );
  const secondPage = (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Address Information</h2>
      <TextField
        error={Boolean(suburbError)}
        sx={{ marginBottom: '10px', backgroundColor: 'white', borderRadius: '4px' }}
        required
        id="suburb"
        label="Suburb"
        type="text"
        value={suburb}
        helperText={suburbError}
        onChange={handleSuburbChange}
        fullWidth
      />
      <TextField
        error={Boolean(detailAddressError)}
        sx={{ marginBottom: '10px', backgroundColor: 'white', borderRadius: '4px' }}
        required
        id="detailAddress"
        label="Detail Address"
        type="text"
        value={detailAddress}
        helperText={detailAddressError}
        onChange={handleDetailAddressChange}
        fullWidth
      />
      <TextField
        error={Boolean(territoryError)}
        sx={{ marginBottom: '10px', backgroundColor: 'white', borderRadius: '4px' }}
        required
        id="territory"
        label="Territory"
        type="text"
        value={territory}
        helperText={territoryError}
        onChange={handleTerritoryChange}
        fullWidth
      />
      <TextField
        error={Boolean(postcodeError)}
        sx={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '4px' }}
        required
        id="postcode"
        label="Postcode"
        type="text"
        value={postcode}
        helperText={postcodeError}
        onChange={handlePostcodeChange}
        fullWidth
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
          onClick={prevPage}
        >
          Prev Page
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
          onClick={nextPage}
        >
          Next Page
        </Button>
      </div>
    </div>
  );

  const thirdPage = (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Additional Details</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {tag.map((tag, index) => (
          <TageComponent key={index} title={tag} alreadySelected={tags.includes(tag)} selectCurrent={selectCurrent} deselectCurrent={deselectCurrent} />
        ))}
      </div>
      <TextField
        error={Boolean(bathroomNumberError)}
        sx={{ marginBottom: '10px', backgroundColor: 'white', borderRadius: '4px' }}
        required
        id="bathroomNumber"
        label="Bathroom Number"
        type="number"
        value={bathroomNumber}
        helperText={bathroomNumberError}
        onChange={handleBathroomNumberChange}
        fullWidth
      />
      {bedroom.map((obj, index) => (
        <BedroomCard key={index} indexId={obj.id} type={obj.type} num={obj.bedNum} deleteBedroom={deleteBedroom} />
      ))}
      {addBedroom}
      {Boolean(bedroomError) && <div style={{ color: 'red', fontStyle: 'italic' }}>{bedroomError}</div>}
      <Button variant='outlined' color='primary' onClick={addNewBedroom} startIcon={<AddCircleIcon />} sx={{ mt: 1 }}>
        Add Bedroom
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
          onClick={prevPage}
        >
          Prev Page
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
          onClick={nextPage}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }
  const FourthPage = (<div>
    <h2 style={{ marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>Add Thumbnails</h2>
    <ImageUploadCard setThumbnail={handleThumbnailChange} target={thumbnail.filter(obj => !isYouTubeVideo(obj))}/>
    <YoutubeUpload setThumbnail={handleThumbnailChange} target={thumbnail.filter(obj => isYouTubeVideo(obj))}/>
    {thumbnailError}
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <Button
          type="button"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
          onClick={prevPage}
        >
          Prev Page
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
        >
            Submit
        </Button>
    </div>

  </div>);
  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {page === 1 && firstPage}
      {page === 2 && secondPage}
      {page === 3 && thirdPage}
      {page === 4 && FourthPage}
    </form>
  );
}
