import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import '../css/checkbox.css'

export default function Checklist() {
  return (
    <div className='sidebar'>
      <div className='text-sidebar'>Type room</div>
      <div className='type-list'>
       
        <FormGroup className='list'> 
          <FormControlLabel control={<Checkbox defaultChecked />} label="Modern" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Minimal" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Art deco" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Boho" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Country" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Industrial" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Rustic" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Other.." />
        </FormGroup>
      </div>
    </div>
  );
}