import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Modal, Checkbox } from 'antd';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import '../../css/img-list.css';

const MyGallery = () => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStyles, setFilterStyles] = useState([]);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchesLg = useMediaQuery(theme.breakpoints.up('lg'));

  let cols;
  if (matchesLg) {
    cols = 4;
  } else if (matchesMd) {
    cols = 3;
  } else if (matchesSm) {
    cols = 2;
  } else {
    cols = 1;
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rooms/getImage/3');
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

  const handleCheckboxChange = (StyleName) => {
    // ปรับ state ของ checkbox เมื่อถูกเลือกหรือไม่ถูกเลือก
    if (filterStyles.includes(StyleName)) {
      setFilterStyles((prevStyles) => prevStyles.filter((filterStyle) => filterStyle !== StyleName));
    } else {
      setFilterStyles((prevStyles) => [...prevStyles, StyleName]);
    }
  };

  return (
    <Box sx={{}} className="style">
      <div>
        {/* เพิ่ม checkbox สำหรับ filter */}
        {['Modern', 'Minimal', 'Art deco', 'Boho', 'Country', 'Industrial', 'Rustic'].map((StyleName) => (
          <Checkbox key={StyleName} onChange={() => handleCheckboxChange(StyleName)}>
            {`Filter ${StyleName}`}
          </Checkbox>
        ))}
      </div>
      <ImageList variant="masonry" cols={cols} gap={10}>
        {images
          .filter((item) => (filterStyles.length === 0 || filterStyles.includes(item.StyleName)))
          .map((item) => (
            <ImageListItem key={item.id} className="image-list-item" onClick={() => handleImageClick(item)}>
              <img
                srcSet={`${item.img}?w=1080&fit=crop&auto=format&dpr=2 2x`}
                src={`../upload/${item.img}?w=1080&fit=crop&auto=format`}
                alt={item.title}
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
};

export default MyGallery;
