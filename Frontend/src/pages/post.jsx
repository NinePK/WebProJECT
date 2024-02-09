import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

export default function CreatePost() {
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    img: '',
    CategoryID: '',
    StyleID: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // สมมติว่า '/api/posts' เป็น endpoint ของคุณสำหรับเพิ่มโพสต์
      const response = await axios.post('http://localhost:8000/api/post/addPost', postData);
      console.log(response.data);
      // จัดการ response ที่นี่, เช่น การแสดงข้อความว่าเพิ่มข้อมูลสำเร็จหรือไม่
    } catch (error) {
      console.error('There was an error creating the post', error);
      // จัดการข้อผิดพลาดที่นี่
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={postData.title}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={postData.description}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL"
          name="img"
          value={postData.img}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Category ID"
          name="CategoryID"
          value={postData.CategoryID}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Style ID"
          name="StyleID"
          value={postData.StyleID}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
}