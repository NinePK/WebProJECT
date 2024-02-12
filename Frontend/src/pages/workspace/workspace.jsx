import React, { useEffect, useRef } from 'react';
import '../../css/home.css';
import Nav from '../../component/nav';

import MyGallery from './imagelist5';

function Workspace() {
  return (
    <div>
    <Nav />
    <div className='bed-main'>
        <div className='bed-cont'>
          <div className='bed-name'>
            <p>Work space</p> 
          </div>

          <div className='bed-cont-mygal'>
            <MyGallery/>
          </div>
        </div>
      </div>
        </div>
    );
}
export default Workspace;