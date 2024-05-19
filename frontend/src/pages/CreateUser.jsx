import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // State to store notification message
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/users', { name, email })
      .then(() => {
        // If the request is successful, set the message state to notify the user
        setMessage('Email stored successfully!');
        // Redirect the user to the home page after a short delay
        setTimeout(() => navigate('/'), 2000);
      })
      .catch(err => {
        console.error(err);
        // If there's an error, set the message state to notify the user
        setMessage('Failed to store email. Please try again later.');
      });
  };

  return (
    <div>
      <h1>Create User</h1>
      {/* Display the message to the user */}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateUser;
