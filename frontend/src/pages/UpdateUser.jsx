import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateUser = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/http://localhost:5000/api/users/${id}`)
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/users/${id}`, { name, email })
      .then(() => navigate('/'))
      .catch(err => {
        console.error(err);
        alert('Failed to update user. Please try again later.');
      });
  };
  

  return (
    <div>
      <h1>Update User</h1>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;
      
