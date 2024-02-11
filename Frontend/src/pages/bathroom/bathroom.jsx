import React, { useEffect, useRef } from 'react';
import '../../css/home.css';
import Nav from '../../component/nav';

import MyGallery from './imagelist2';


function Bathroom() {
  return (
    <div>
          <Nav />
      <div className='bed-main'>
        <div className='bed-cont'>
          <div className='bed-name'>
            <p>Bath room</p> 
          </div>

          <div className='bed-cont-mygal'>
            <MyGallery/>
          </div>
        </div>
      </div>
    </div>
    );
}
export default Bathroom;