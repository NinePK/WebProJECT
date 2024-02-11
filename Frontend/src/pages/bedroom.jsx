import React from 'react';

import '../css/bedroom.css'

import Nav from '../component/nav'
import Checklist from './checkbox';
import MyGallery from './imagelist';


export default function Bedroom() {
  return (
    <div>
      <Nav />
      
      <div className='bed-main'>
        <div className='bed-cont'>
          <div className='bed-name'>
            <p>-Bed room-</p> 
          </div>
        <div className='bed-cont2'>
          <Checklist />
          <div className='bed-cont-mygal'>
            <MyGallery/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

