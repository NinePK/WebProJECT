import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { Select, Modal, Button, Upload } from 'antd';
import { UploadOutlined,PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


const { Option } = Select;

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [CategoryID, setCategoryID] = useState('');
  const [StyleID, setStyleID] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const UserID = localStorage.getItem('UserID');

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
        <form>
          <div>
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDesc(e.target.value)} />
          </div>

          <div>
            <label>Category:</label>
            <Select value={CategoryID} onChange={value => setCategoryID(value)} style={{ width: '100%' }}>
              {categories.map(category => (
                <Option key={category.CategoryName} value={category.CategoryID}>
                  {category.CategoryName}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label>Style:</label>
            <Select value={StyleID} onChange={value => setStyleID(value)} style={{ width: '100%' }}>
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
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </form>
      </Modal>
      {error && <p>{error}</p>}
    </div>
  );
};

export default PostForm;
