// CreateEmail.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateEmail = () => {
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/emails', { subject, sender });
      // Handle success (e.g., show success message)
    } catch (err) {
      console.error(err);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div>
      <h1>Create Email</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input type="text" placeholder="Sender" value={sender} onChange={(e) => setSender(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateEmail;
