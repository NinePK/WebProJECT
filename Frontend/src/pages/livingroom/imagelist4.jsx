import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Select, Modal, Button, Upload, Form, Input, AutoComplete, Checkbox } from 'antd';
import { UploadOutlined, FormOutlined, DeleteTwoTone, HeartFilled } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import '../../css/img-list.css';
import '../../css/bedroom.css';

const { Option } = Select;
const MyGallery = () => {
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterStyles, setFilterStyles] = useState([]);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchesLg = useMediaQuery(theme.breakpoints.up('lg'));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [CategoryID, setCategoryID] = useState('');
  const [StyleID, setStyleID] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const UserID = localStorage.getItem('UserID');
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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
    axios.get('http://localhost:8000/api/rooms/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    axios.get('http://localhost:8000/api/rooms/styles')
      .then(response => {
        setStyles(response.data);
      })
      .catch(error => {
        console.error('Error fetching styles:', error);
      });
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rooms/getImage/5');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();

    const fetchLikesCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/post/likesCount/${selectedImage.id}`);
        setLikesCount(response.data.likesCount);
      } catch (error) {
        console.error('Error fetching likes count:', error);
      }
    };

    if (selectedImage) {
      fetchLikesCount();
    }
  }, [selectedImage]);
  ///////////////////////////////////////////////////////////

  /////////////////////////////////////////LIKE////////////////////////////////////////
  const handleLike = async () => {
    if (!isLiked) {
      try {
        await axios.post(`http://localhost:8000/api/post/like/${selectedImage.id}`, { postId: selectedImage.id, userId: UserID }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setLikesCount(likesCount + 1); // เพิ่มจำนวนถูกใจทันทีหลังจากกดถูกใจ
        setIsLiked(true); // อัปเดต state เพื่อบ่งชี้ว่าผู้ใช้ได้กดไลค์แล้ว
        console.log('Liked successfully');
      } catch (error) {
        console.error('Error liking post:', error);
      }
    }
  };

  /////////////////////////////////////////LIKE////////////////////////////////////////
  const uploadProps = {
    beforeUpload: file => {
      setFile(file);
      return false; // Prevent automatic upload
    },
    file,
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setTitle(image.title);
    setDescription(image.description);
    setCategoryID(image.CategoryID);
    setStyleID(image.StyleID);
    setModalVisible(true);

    // ตรวจสอบสิทธิ์การแก้ไข โดยเปรียบเทียบ uid ของรูปภาพกับ UserID ใน localStorage
    const currentUserID = localStorage.getItem('UserID');
    setCanEdit(image.uid.toString() === currentUserID);
  };
  const showModal = () => {
    setIsModalVisible(true);
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
  /////////////////////////////////////////
  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure delete this post?',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8000/api/post/deletePost/${selectedImage.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('Post deleted successfully');

          // อัปเดตรายการภาพหลังจากลบ
          const updatedImages = images.filter(item => item.id !== selectedImage.id);
          setImages(updatedImages);

          // ปิด Modal
          closeModal();
        } catch (err) {
          console.error('Error deleting post:', err);
          setError(err.response ? err.response.data.message : 'An error occurred while deleting the post');
        }
      },
      onCancel() {
        console.log('Cancel delete');
      },
    });
  };
  /////////////////////////////////////////
  const handleCheckboxChange = (StyleName) => {
    // ปรับ state ของ checkbox เมื่อถูกเลือกหรือไม่ถูกเลือก
    if (filterStyles.includes(StyleName)) {
      setFilterStyles((prevStyles) => prevStyles.filter((filterStyle) => filterStyle !== StyleName));
    } else {
      setFilterStyles((prevStyles) => [...prevStyles, StyleName]);
    }
  };
  const handleEdit = async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/api/upload", formData);
      const imgUrl = res.data;

      axios.put(`http://localhost:8000/api/post/editPost/${selectedImage.id}`,
        { title, description, img: imgUrl, CategoryID, StyleID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }

      );
      console.log(res.data);
      console.log('Post up successfully');
    } catch (err) {
      setError(err.response.data.error);
    }
  };
  const handleOk = async () => {
    setIsModalVisible(false);
    await handleEdit();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };
  return (
    <Box sx={{}} className="style">
      <div className='bed-cont'>
        <div className='bed-cont2'>
          <div className='checkbox-cont'>
            <h1>Style&nbsp;rooms</h1>
            <hr style={{ border: '1px solid #ccc', marginTop: '-3px', marginBottom: '5px' }} />
            {['Modern', 'Minimal', 'Art deco', 'Boho', 'Country', 'Industrial', 'Rustic'].map((StyleName) => (
              <Checkbox key={StyleName} className='checkbox-cont-text' onChange={() => handleCheckboxChange(StyleName)}>
                {`${StyleName}`}
              </Checkbox>
            ))}
          </div>

          <div className='bed-cont-mygal'>
            <ImageList variant="masonry" cols={cols} gap={12}>
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
          </div>

        </div>
      </div>
      <Modal
        title="Image Details"
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        style={{ paddingTop: '30px', paddingBottom: '30px', height: '200%' }}
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
            {canEdit ? [ // ตรวจสอบสิทธิ์การแก้ไขก่อนแสดงปุ่ม
              <Button key="edit" type="primary" onClick={showModal}>
                <FormOutlined /> Edit
              </Button>,
              <Button key="delete" type="primary" danger onClick={handleDelete}>
                <DeleteTwoTone /> Delete
              </Button>

            ] : null}
            <Button
              className="like-button"
              type="text"
              icon={<HeartFilled onClick={handleLike} style={{ color: isLiked ? 'red' : 'gray' }} />} 
            >
              {likesCount}
            </Button>

            <Modal title="Edit Post" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <Form>
                <div>
                  <label>Title:</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <AutoComplete
                    value={description}
                    options={autoCompleteOptions}
                    onChange={handleDescriptionChange}
                    placeholder="Enter description"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label>Category:</label>
                  <Select
                    value={CategoryID}
                    onChange={value => setCategoryID(value)}
                    placeholder="Select a category"
                    style={{ width: '100%' }}
                  >
                    {categories.map(category => (
                      <Option key={category.CategoryName} value={category.CategoryID}>
                        {category.CategoryName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Style:</label>
                  <Select
                    value={StyleID}
                    onChange={value => setStyleID(value)}
                    placeholder="Select a style"
                    style={{ width: '100%' }}
                  >
                    {styles.map(style => (
                      <Option key={style.StyleName} value={style.StyleID}>
                        {style.StyleName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Upload:</label>
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Click to Upload Image</Button>
                  </Upload>
                </div>
              </Form>
            </Modal>
          </div>
        )}
      </Modal>
    </Box>
  );
};

export default MyGallery;
