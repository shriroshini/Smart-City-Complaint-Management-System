import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register as registerApi } from '../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const { data } = await registerApi(formData);
      login(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Cannot connect to server. Please make sure the backend is running.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Register</button>
          </form>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
