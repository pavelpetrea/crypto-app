import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './SelectCurrency.css';

export default function BasicSelect() {
  const [currency, setCurrency] = useState('USD');
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <div className='SelectCurrency'>
    <Box sx={{ minWidth: 120 }} >
      <FormControl fullWidth>
        <InputLabel sx={{ color: 'white' }}>Currency</InputLabel>
        <Select sx={{ color: 'white' }} className='my-custom-select2'
          id="demo-simple-select"
          value={currency}
          label="Currency"
          onChange={handleChange}
        >
          <MenuItem value={"USD"}>USD $</MenuItem>
        </Select>
      </FormControl>
    </Box>
    </div>
  );
}