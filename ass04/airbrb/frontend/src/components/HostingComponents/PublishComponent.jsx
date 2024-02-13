import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { DateRangePicker } from './DateRangePicker';
import { publishListing } from '../../utils/request';

export const PublishComponent = ({ listingObject, handlePublishClose, setShouldUpdateListings }) => {
  const [dateRange, setDateRange] = useState([]);
  const [pickerCount, setPickerCount] = useState(0);
  const [error, setError] = useState(null);
  const addNewPicker = () => {
    setPickerCount(pickerCount + 1);
    setDateRange(prev => [...prev, { id: pickerCount, start: '', end: '' }]);
  }

  const handleSubmit = async () => {
    const temp = dateRange.some(obj => !obj.start || !obj.end);
    if (temp || dateRange.length === 0) {
      setError('Invalid date ranges');
      return;
    } else setError(null);
    const result = dateRange.map((obj) => { return { id: obj.id, start: obj.start.toISOString(), end: obj.end.toISOString() } });
    console.log(result);
    await publishListing(listingObject.id, { availability: result });
    setShouldUpdateListings(true);
    handlePublishClose();
  }

  const handleDelete = (id) => {
    setDateRange(prevPickers => prevPickers.filter(obj => obj.id !== id))
  }

  const updatePicker = (id, start, end) => {
    setDateRange(prevDate => {
      const updatedDate = prevDate.map(obj => {
        if (obj.id === id) return { ...obj, start, end };
        return obj;
      });
      const found = prevDate.some(obj => obj.id === id);
      if (!found) {
        console.error('Picker object not found');
        return prevDate;
      }
      return updatedDate;
    });
  }

  useEffect(() => {
    console.log(dateRange);
  }, []);
  return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
  {dateRange.map(obj => (
    <DateRangePicker
      key={obj.id}
      id={obj.id}
      dateRange={dateRange}
      updatePicker={updatePicker}
      handleDelete={handleDelete}
    />
  ))}
  <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
  <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }}>
    <Button
      type="button"
      variant="outlined"
      color="primary"
      sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
      onClick={addNewPicker}
    >
      Add New Picker
    </Button>
    <Button
      type="button"
      variant="outlined"
      color="primary"
      sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }}
      onClick={handleSubmit}
    >
      Publish Now
    </Button>
  </div>
</div>);
}
