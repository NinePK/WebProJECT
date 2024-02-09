import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from './nav';
import axios from 'axios';

const defaultTheme = createTheme();

export default function SignUp() {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
    });
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        // Send the data as JSON to your backend API
        const response = await axios.post('http://localhost:8000/api/users/register', formData, {
          headers: {
            'Content-Type': 'application/json',
          }
          
          
        });
  
        console.log('Response from backend:', response.data);
      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
    
  return (
    <div>
      <Nav />
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white', 
            padding: 3, 
            borderRadius: 8, 
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register your account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
              Sign Up
            </Button>           
          </Box>
        </Box>
      </Container>
    </ThemeProvider> 
    </div>
  );
}