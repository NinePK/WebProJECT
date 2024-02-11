import React, { useContext, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { AuthContext } from '../context/authContext'; 
import { useNavigate } from 'react-router-dom'
import Nav from './nav'

const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ใช้ useNavigate hook
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful!');
      navigate('/home'); // นำทางไปยังหน้าหลัก
      setLoading(false);
    } catch (error) {
      message.error('Failed to login!');
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
       <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <h1>Login</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
   
  );
};

export default Login;