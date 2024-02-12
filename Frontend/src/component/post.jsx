import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Modal, Button, Upload, Form, Input, AutoComplete } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


const { Option } = Select;

const PostForm = () => {
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
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    await handleSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const uploadProps = {
    beforeUpload: file => {
      setFile(file);
      return false; // Prevent automatic upload
    },
    file,
  };
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };
  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/api/upload", formData);
      const imgUrl = res.data;

      await axios.post(
        'http://localhost:8000/api/post/addPost',
        { title, description, img: imgUrl, uid: UserID, CategoryID, StyleID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Post created successfully');
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <div>
      <Link type="primary" onClick={showModal}>
        Post&nbsp;<FontAwesomeIcon icon={faPen} size="sm"/>
      </Link>
      <Modal title="Create a Post" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
      {error && <p>{error}</p>}
    </div>
  );
};

export default PostForm;
