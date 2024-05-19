import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #f0f0f0;
  }
`;

// Define dark mode theme
const darkTheme = {
  body: '#121212', // Dark background color
  text: '#f0f0f0', // Light text color
  containerBg: '#333' // Container background color
};

// Main container
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.containerBg}; /* Use theme variable for container background color */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// Title style
const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #fff;
`;

// Form style
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// Label style
const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

// Input style
const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  background-color: #1e1e1e; /* Dark input background color */
  color: #e0e0e0; /* Light text color */
`;

// Textarea style
const Textarea = styled.textarea`
  width: 100%; /* Set width to 100% */
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  resize: vertical;
  background-color: #5E5C5C; /* Dark input background color */
  color: #E3DCDC; /* Light text color */
  height: 200px; /* Set height to 200px */
`;

// Button style
const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// Success message style
const SuccessMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  text-align: center;
`;

const UpdateEmail = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [success, setSuccess] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const recipientEmail = localStorage.getItem('recipientEmail');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/emails/${id}`);
        setSubject(response.data.subject);
        setBody(response.data.body);
      } catch (err) {
        console.error('Error fetching email:', err);
      }
    };

    fetchEmail();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // First, delete the old email
      await axios.delete(`http://localhost:5000/api/emails/${id}`);
      
      // Retrieve recipient value from localStorage
      const recipient = localStorage.getItem('recipient');
      
      // Then, post the updated email
      await axios.post(`http://localhost:5000/api/emails`, {
        sender: userEmail,
        recipient: recipientEmail,
        subject,
        body
      });
      
      // Set success state to true and redirect after a delay
      setSuccess(true);
      setTimeout(() => {
        navigate('/emails'); // Redirect to the list of emails after 2 seconds
      }, 2000);
    } catch (err) {
      console.error('Error updating email:', err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Container>
        <Title>Update Email</Title>
        <Form onSubmit={handleUpdate}>
          <Label>Subject:</Label>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Label>Body:</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button type="submit">Update Email</Button>
        </Form>
        {success && (
          <SuccessMessage>Email updated successfully! Redirecting...</SuccessMessage>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default UpdateEmail;
