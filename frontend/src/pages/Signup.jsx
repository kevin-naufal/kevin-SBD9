import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Main container
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e1e; /* Dark background color */
`;

// Container for the signup form
const FormContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center;
  text-align: center;
  width: 50%; /* Reduce width to 50% */
  max-width: 400px; /* Add max-width to limit the width on larger screens */
  background-color: #333; /* Grey background */
  padding: 30px; /* Add padding for better visibility */
`;

// Title style
const Title = styled.h2`
  color: #e0e0e0;
  font-size: 24px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif; /* Change font family */
  font-weight: bold; /* Make it bold */
`;

// Error message style
const ErrorMessage = styled.p`
  color: #f6f6f6;
  margin-bottom: 10px; /* Add margin-bottom */
`;

// Form style
const Form = styled.form`
  text-align: center;
`;

// Input style
const Input = styled.input`
  background-color: #1e1e1e;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 8px 10px; /* Adjust padding */
  border-radius: 5px; /* Adjust border radius */
  margin-bottom: 15px; /* Increase bottom margin */
  width: 100%; /* Take up full width */
  box-sizing: border-box; /* Include padding and border in width calculation */
  font-size: 14px; /* Adjust font size */

  &::placeholder {
    color: #888;
  }
`;

// Button style
const Button = styled.button`
  background-color: #2764a5;
  border: none;
  color: white;
  padding: 10px 20px; /* Adjust padding */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%; /* Take up full width */
  font-size: 16px; /* Adjust font size */

  &:hover {
    background-color: #1d4f7b;
  }
`;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Signup incomplete. Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users', { name, email, password });
      setSuccessMessage(response.data.message);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setSuccessMessage('');
        setError('');
        navigate('/'); // Navigate back to home page
      }, 2000);
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  return (
    <MainContainer>
      <FormContainer>
        <Title>Signup</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <ErrorMessage>{successMessage}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit">Signup</Button>
        </Form>
      </FormContainer>
    </MainContainer>
  );
};

export default Signup;
