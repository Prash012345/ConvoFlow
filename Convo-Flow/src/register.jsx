import { useState } from 'react';
import axios from 'axios';
import './signup.css';
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData);
      setMessage(response.data.message);
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      window.location.href = "http://localhost:3000/login";
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('There was an error registering the user!', error);
    }
  };

  return (
    <div className="register-container">
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login" >
          <label>Already have an account? <a href='/login'>Login </a></label>
        </div>
    
        
        <button type="submit">Sign Up</button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
