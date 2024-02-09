import React, { useEffect, useRef } from 'react';

import '../css/home.css';

import pic from '../picture/pexels-ilya-shakir-2440471.jpg';
import pic2 from '../picture/pexels-mark-2724749.jpg';
import pic3 from '../picture/pexels-pixabay-271618.jpg';
import pic4 from '../picture/bathroom-3563272.jpg';
import pic5 from '../picture/office-8503515.png';
import logogroovy from '../picture/groovy.png';
import Nav from './nav';
import AddPost from './post';
function Home() {
  return (
    <div>     
      <Nav />
      <AddPost />
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
          <p>Livingroom</p>
          </div>
        </div>
        
        <div class="image-container">
          <img src={pic2} class="img"/>
          <div class="overlay">
          <p>Kitchen</p>
          </div>
        </div>

        <div class="image-container">
          <img src={pic3} class="img"/>
          <div class="overlay">
          <p>Bedroom</p>
          </div>
        </div>

        <div class="image-container">
          <img src={pic4} class="img"/>
          <div class="overlay">
          <p>Bathroom</p>
          </div>
        </div>

        <div class="image-container">
          <img src={pic5} class="img"/>
          <div class="overlay">
          <p>Workspace</p>
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
