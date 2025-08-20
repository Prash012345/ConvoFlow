import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faPhone, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import './UserProfile.css';

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Fetch user data from backend API
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        const response = await axios.get('http://localhost:8000/api/profile', {
          headers: {
            Authorization: `${token}`,
          },
        });

        const profile = response.data.Profile;

        // Update the state with fetched data
        setUserDetails({
          name: profile.name,
          birthday: '13-11-2004', // Replace with actual data when available
          phone: '91+ 8777417805', // Replace with actual data when available
          id: profile._id, // Replace with actual data when available
          email: profile.email,
          password: profile.password, // Keep it masked
          avatar: profile.avatar ? `http://localhost:8000/uploads/${profile.avatar}` : 'https://via.placeholder.com/100', // If avatar exists, use it, otherwise placeholder
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    try {

      // Create a payload with only the necessary fields
      const payload = {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
      };

      const response = await axios.post('http://localhost:8000/api/updateprofile', payload, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessage(response.data.message || 'Profile updated successfully!');
    } catch (error) {
      setMessage('Profile update failed. Please try again.');
      console.error('There was an error updating the profile!', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {/* <button className="back-button">&larr;</button> */}
        <h1 className="profile-header">{userDetails.name}</h1>
        {/* <div className="profile-picture">
          <img
            src={userDetails.avatar}
            alt="Profile"
            className="profile-image"
          />
        </div> */}
      </div>

      <div className="profile-details">
        {/* <div className="profile-item">
          <FontAwesomeIcon icon={faBirthdayCake} />
          <input type="text" value={userDetails.birthday} />
        </div> */}
        {/* <div className="profile-item">
          <FontAwesomeIcon icon={faPhone} />
          <input type="text" value={userDetails.phone} />
        </div> */}
        <div style={{
          marginBottom : "20px",
          justifyContent : "center"
          }} className="profile-item">
          {/* <FontAwesomeIcon icon={faInstagram} /> */}
          {/* <div>{userDetails.id}</div> */}
        </div>
        <div className="profile-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <input type="email" value={userDetails.email} />
        </div>
        <div className="profile-item">
          <FontAwesomeIcon icon={faLock} />
          <input type="text" value={userDetails.password} />
        </div>
      </div>

      <button onClick={handleSubmit} className="edit-button">Edit Profile</button>
    </div>
  );
};

export default UserProfile;
