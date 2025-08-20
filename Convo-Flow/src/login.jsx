import React, { useState } from 'react';
import './login.css'; // You can add some custom styles for the login page

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login was successful
        setMessage('Login successful!');

        const token = data.token;
        console.log(token);
        localStorage.setItem("token",data.token);
        localStorage.setItem("id",data.id);
        localStorage.setItem("username",data.username);

        window.location.href = "http://localhost:3000/dashboard";
        
      } else {
        // Login failed
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login ConvoFlow</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="/">SignUp</a>
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
