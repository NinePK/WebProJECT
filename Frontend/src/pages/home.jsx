import React, { useEffect, useRef } from 'react';

import '../css/home.css';

import pic from '../picture/pexels-ilya-shakir-2440471.jpg';
import pic2 from '../picture/pexels-mark-2724749.jpg';
import pic3 from '../picture/pexels-pixabay-271618.jpg';
import pic4 from '../picture/bathroom-3563272.jpg';
import pic5 from '../picture/office-8503515.png';
import logogroovy from '../picture/groovy.png';
import Nav from '../component/nav';
import AddPost from '../component/post';
import { Link } from 'react-router-dom';
function Home() {
  const [open, setOpen] = React.useState(false);

const handleClose = () => {
  setOpen(false);
};

  const handleOpen_bedroom = () => {
    setOpen(true);
    setTimeout(() => {
      window.location.href = '/bedroom'; 
    }, 1000); 
  };

  const handleOpen_livingroom = () => {
    setOpen(true);
    setTimeout(() => {
      window.location.href = '/livingroom'; 
    }, 1000); 
  };

  const handleOpen_Bathroom = () => {
    setOpen(true);
    setTimeout(() => {
      window.location.href = '/bathroom'; 
    }, 1000); 
  };

  const handleOpen_kitchen = () => {
    setOpen(true);
    setTimeout(() => {
      window.location.href = '/kitchen'; 
    }, 1000); 
  };
  
  const handleOpen_workspace = () => {
    setOpen(true);
    setTimeout(() => {
      window.location.href = '/workspace'; 
    }, 1000); 
  };


  return (
    <div>     
      <Nav />
      <div className="main">
        <div className="h1">
          <div className="welcome">Welcome to Groovy Design</div> 
          Explore the latest in modern home decor on our website. Discover ideas and 
          products that will turn your home into a cozy haven. 
          Start creating warmth and comfort in your space right here. Enjoy!!!
        </div>
      </div>

      <div className='se-main'>
        <div class="image-container">
          <img src={pic} class="img"/>
          <div class="overlay">
            <Link to="/livingroom" onClick={handleOpen_livingroom}>
              <p>LivingRoom</p>
            </Link>
          </div>
        </div>
        
        <div class="image-container">
          <img src={pic2} class="img" />
          <div class="overlay">
            <Link to="/kitchen" onClick={handleOpen_kitchen}>
              <p>Kitchen</p>
            </Link>
          </div>
        </div>

        <div class="image-container">
          <img src={pic3} class="img"/>
          <div class="overlay">
            <Link to="/bedroom" onClick={handleOpen_bedroom}>
                <p>BedRoom</p>
            </Link>
          </div>
        </div>

        <div class="image-container">
          <img src={pic4} class="img"/>
          <div class="overlay">
            <Link to="/bathroom" onClick={handleOpen_Bathroom}>
              <p>Bathroom</p>
            </Link>
          </div>
        </div>

        <div class="image-container">
          <img src={pic5} class="img"/>
          <div class="overlay">
            <Link to="/workspace" onClick={handleOpen_workspace}>
              <p>Workspace</p>
            </Link>
        </div>
      </div>  
    </div>      
      <footer className="footer">
        <div className = 'footer-con'>
        <ul className="menu-footer">
          <li><a href="#" >About Us</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
    </div>

    </footer>
    </div>
);
}

export default Home;
