import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import axios from 'axios'; 
import { Modal } from 'antd';

import '../css/img-list.css';

export default function MyGallery() {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rooms/getImage/1'); 
        setImages(response.data); 
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year}-${hours}:${minutes}`;
  };

  return (
    <Box sx={{}} className='style'>
      <ImageList variant="masonry" cols={4} gap={14}>
        {images.map((item) => (
          <ImageListItem key={item.id} className="image-list-item" onClick={() => handleImageClick(item)}>
            <img
              srcSet={`${item.img}?w=1080&fit=crop&auto=format&dpr=2 2x`}
              src={`../upload/${item.img}?w=1080&fit=crop&auto=format`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        title="Image Details"
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {selectedImage && (
          <div>
            <img
              src={`../upload/${selectedImage.img}`}
              alt={selectedImage.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <p><strong>Title:</strong> {selectedImage.title}</p>
            <p><strong>Description:</strong> {selectedImage.description}</p>
            <p><strong>Username:</strong> {selectedImage.Username}</p>
            <p><strong>Create Date:</strong> {formatDateTime(selectedImage.CreateDate)}</p>
            <p><strong>Category:</strong> {selectedImage.CategoryName}</p>
            <p><strong>Style:</strong> {selectedImage.StyleName}</p>
          </div>
        )}
      </Modal>
    </Box>
  );
}
