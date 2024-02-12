import React, { useEffect, useRef } from 'react';
import '../../css/home.css';
import Nav from '../../component/nav';

import MyGallery from './imagelist3';

function Kitchen() {
  return (
    <div>
    <Nav />

      <div className='bed-main'>
        <div className='bed-cont'>
          <div className='bed-name'>
            <p>Kitchen</p> 
          </div>

          <div className='bed-cont-mygal'>
            <MyGallery/>

          </div>
        </div>
      </div>
        </div>
    );
}
export default Kitchen;