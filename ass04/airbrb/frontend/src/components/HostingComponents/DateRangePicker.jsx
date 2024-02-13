import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import dayjs from 'dayjs';

export const DateRangePicker = ({ id, dateRange, updatePicker, handleDelete }) => {
  const [startValue, setStartValue] = React.useState(null);
  const [endValue, setEndValue] = React.useState(null);
  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
  const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);
  const checkValidDateRange = (date) => {
    for (const i of dateRange) {
      if (i.id === id) continue;
      if (i.start !== '' && i.end !== '' &&
          dayjs(date).isSameOrAfter(i.start) &&
          dayjs(date).isSameOrBefore(i.end)) {
        return true;
      }
    }
    return false;
  };
  const checkValidDateRangeForStart = (date) => {
    return dayjs().isSameOrAfter(date) || checkValidDateRange(date) || (endValue && dayjs(endValue).isBefore(date)) || checkStartValid(date);
  };

  const checkValidDateRangeForEnd = (date) => {
    return (startValue && dayjs(startValue).isAfter(date)) || checkValidDateRange(date) || checkEndValid(date);
  };
  const checkStartValid = (val) => {
    if (!endValue) return false;
    for (const i of dateRange) {
      if (i.id === id) continue;
      if (i.start !== '' && i.end !== '' && ((dayjs(i.start).isAfter(dayjs(val)) && dayjs(i.start).isBefore(dayjs(endValue))) || (dayjs(i.end).isAfter(dayjs(val)) && dayjs(i.end).isBefore(dayjs(endValue))))) return true;
    }
    return false;
  }
  const checkEndValid = (val) => {
    if (!startValue) return false;
    for (const i of dateRange) {
      if (i.id === id) continue;
      if (i.start !== '' && i.end !== '' && ((dayjs(i.start).isAfter(dayjs(startValue)) && dayjs(i.start).isBefore(dayjs(val))) || (dayjs(i.end).isAfter(dayjs(startValue)) && dayjs(i.end).isBefore(dayjs(val))))) return true;
    }
    return false;
  }
  const handleStartChange = (val) => {
    setStartValue(val);
    updatePicker(id, val, endValue);
  }
  const handleEndChange = (val) => {
    setEndValue(val);
    updatePicker(id, startValue, val);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style = {{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '500px' }}>
      <DatePicker
        sx = {{ marginRight: '20px', width: '100px', flexGrow: '1' }}
        label="Start"
        value={startValue}
        onChange={(newValue) => handleStartChange(newValue)}
        shouldDisableDate={checkValidDateRangeForStart}
      />
      <div>-</div>
      <DatePicker
        sx = {{ marginLeft: '20px', width: '100px', flexGrow: '1' }}
        label="End"
        value={endValue}
        onChange={(newValue) => handleEndChange(newValue)}
        shouldDisableDate={checkValidDateRangeForEnd}
      />
      <IconButton aria-label="delete" onClick={() => handleDelete(id)}>
        <DeleteIcon />
      </IconButton>
      </div>
    </LocalizationProvider>
  );
}
