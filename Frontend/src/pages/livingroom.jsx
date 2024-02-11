import React, { useEffect, useRef } from 'react';
import '../css/home.css';
import Nav from '../component/nav';

import MyGallery from './imagelist4';

function Livingroom() {
  return (
    <div>
    <Nav />
    <div className='bed-main'>
        <div className='bed-cont'>
          <div className='bed-name'>
            <p>Living room</p> 
          </div>

          <div className='bed-cont-mygal'>
            <MyGallery/>

          </div>
        </div>
      </div>
        </div>
    );
}
export default Livingroom;