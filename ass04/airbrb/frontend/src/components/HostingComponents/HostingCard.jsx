import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { TageViewComponent } from './TagViewComponent';
import BathtubIcon from '@mui/icons-material/Bathtub';
import DeleteIcon from '@mui/icons-material/Delete';
import { BedroomView } from './BedRoomView';
import { unpublishListing, deleteListing } from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import BedIcon from '@mui/icons-material/Bed';
import dayjs from 'dayjs';
import HistoryIcon from '@mui/icons-material/History';
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const HostingCard = ({ listingObject, handleEditOpen, setShouldUpdateListings, handlePublishOpen }) => {
  console.log(listingObject);
  const [expanded, setExpanded] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(0);
  const navigate = useNavigate();
  const handleDelete = async () => {
    await deleteListing(listingObject.id);
    setShouldUpdateListings(true);
  }

  const handleUnpublish = async () => {
    await unpublishListing(listingObject.id);
    setShouldUpdateListings(true);
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const nextImage = () => {
    if (currentImage < listingObject.thumbnail.length - 1) setCurrentImage(currentImage + 1);
  }
  const prevImage = () => {
    if (currentImage > 0) setCurrentImage(currentImage - 1);
  }
  const getTotalLikes = () => {
    let res = 0.0;
    for (const i of listingObject.reviews) {
      res += i.rating;
    }
    if (listingObject.reviews.length !== 0) res /= listingObject.reviews.length;
    return res;
  }
  const ImageComponent = () => {
    const backgroundImageStyle = {
      backgroundImage: `url(${listingObject.thumbnail[currentImage]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '400px'
    };
    return (<div style = {{ width: '100%', position: 'relative', height: '194px', ...backgroundImageStyle }}>
      { currentImage > 0 && <IconButton aria-label="prevImage" onClick={prevImage} sx={{ position: 'absolute', left: '0', top: '50%', transformY: 'translate(-50%)' }}>
        <ArrowBackIosNewIcon />
      </IconButton> }
      { currentImage < listingObject.thumbnail.length - 1 && <IconButton aria-label="nextImage" onClick={nextImage} sx={{ position: 'absolute', right: '0', top: '50%', transformY: 'translate(-50%)' }}>
        <ArrowForwardIosIcon />
      </IconButton>}
    </div>);
  };
  const YoutubeVideo = () => {
    const currThumbnail = listingObject.thumbnail[currentImage];
    const autoplayUrl = currThumbnail.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1';
    return (<div style = {{ width: '100%', position: 'relative', height: '300px' }}>
      { currentImage > 0 && <IconButton aria-label="prevImage" onClick={prevImage} sx={{ position: 'absolute', left: '0', top: '50%', transformY: 'translate(-50%)' }}>
        <ArrowBackIosNewIcon />
      </IconButton> }
      { currentImage < listingObject.thumbnail.length - 1 && <IconButton aria-label="nextImage" onClick={nextImage} sx={{ position: 'absolute', right: '0', top: '50%', transformY: 'translate(-50%)' }}>
        <ArrowForwardIosIcon />
      </IconButton>}
      <iframe src={autoplayUrl} title="YouTube video" style={{ width: '100%', height: '300px' }} />
    </div>);
  }
  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  return (
    <Card sx={{ minWidth: 400, maxWidth: 500 }}>
    <CardHeader
        title={listingObject.title}
        subheader={`Created at: ${dayjs(listingObject.metadata.createDate).format('DD/MM/YYYY')}`}
        sx={{ bgcolor: '#f5f5f5' }}
      />
    { !isYouTubeVideo(listingObject.thumbnail[currentImage]) && <CardMedia
      component={ImageComponent}
      height="194"
    />}
    { isYouTubeVideo(listingObject.thumbnail[currentImage]) && <CardMedia
      component={YoutubeVideo}
      height="194"
    />}
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {listingObject.metadata.propertyType}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {listingObject.address.territory}, {listingObject.address.suburb}, {listingObject.address.detailAddress}, {listingObject.address.postcode}
      </Typography>
      { !listingObject.published &&
        <Typography paragraph sx={{ color: 'red' }}>Publish required</Typography>
      }
    </CardContent>
    <CardActions disableSpacing sx={{ justifyContent: 'space-between', flexWrap: 'wrap', padding: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarIcon sx={{ color: 'gold' }} />
          {listingObject.reviews.length !== 0 && <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 1 }}>
            {'Likes: ' + getTotalLikes() + ' average'}
          </Typography>}
          {listingObject.reviews.length === 0 && <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 1 }}>
            {'No reviews yet'}
          </Typography>}
        </Box>
        <Box>
          {!listingObject.published &&
            <Button
              type="button"
              variant="outlined"
              color="primary"
              sx={{ margin: '5px' }}
              onClick={handlePublishOpen}
            >
              Publish
            </Button>
          }
          {listingObject.published &&
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              sx={{ margin: '5px' }}
              onClick={handleUnpublish}
            >
              Unpublish
            </Button>
          }
          <Button
            type="button"
            variant="outlined"
            sx={{ margin: '5px' }}
            onClick={() => handleEditOpen(listingObject)}
          >
            Edit
          </Button>
          <Button variant="outlined" onClick={handleDelete} startIcon={<DeleteIcon />} sx={{ margin: '5px' }}>
            Delete
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/hosting/listing/history/${listingObject.id}`)} startIcon={<HistoryIcon />} sx={{ margin: '5px' }}>
            History
          </Button>
        </Box>
      <ExpandMore
        expand={expanded}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </ExpandMore>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
        Amenities:
      </Typography>
        <Grid container spacing={2}>
          {listingObject.metadata.amenities.map((title, index) => (
            <Grid item key={index}>
              <TageViewComponent title={title} />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <BathtubIcon sx={{ mr: 1, color: 'skyblue' }} />
            <Typography variant="body2">
              {listingObject.metadata.bathroomNumber} bathrooms.
            </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <BedIcon sx={{ mr: 1, color: 'lightgreen' }} />
            <Typography variant="body2">
              {listingObject.metadata.bedroom.length} bedrooms.
            </Typography>
          </Grid>
        </Grid>
          {listingObject.metadata.bedroom.map((obj, index) => <BedroomView key={index} type={obj.type} num={obj.bedNum} />) }
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              Description:
            </Typography>
            { listingObject.metadata.description && listingObject.metadata.description !== ''
              ? (<Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>{listingObject.metadata.description}</Typography>)
              : (
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                No description.
              </Typography>
                )}
          </Box>
      </CardContent>
    </Collapse>
  </Card>
  );
}
