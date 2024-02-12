import React, { useContext, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { AuthContext } from '../context/authContext'; 
import { useNavigate } from 'react-router-dom';
import Nav from './nav';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '20px', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' ,  backgroundColor: 'white', }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
              style={{ marginBottom: '20px' }} 
            >
              <Input placeholder="Email" style={{ height: '50px', fontSize: '16px' }} /> 
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
              style={{ marginBottom: '50px' }} 
            >
              <Input.Password placeholder="Password" style={{ height: '50px', fontSize: '16px' }} /> 
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                style={{ width: '100%', backgroundColor: '#52c41a', borderColor: '#52c41a'  }} 
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
