import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #e0e0e0;
    font-family: Arial, sans-serif;
  }
`;

// Main container
const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

// Title style
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif; /* Change font family */
  font-weight: bold; /* Make it bold */
`;

// Error and success message style
const Message = styled.p`
  text-align: center;
  color: ${props => (props.error ? 'red' : 'green')};
`;

// Form style
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

// Input and button style
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #1e1e1e;
  color: #e0e0e0;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #1e1e1e;
  color: #e0e0e0;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background: #007bff;
  color: #fff;
  cursor: pointer;
`;

const SendEmail = () => {
  const userEmail = localStorage.getItem('userEmail');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if recipient email is the same as sender email
    if (recipient === userEmail) {
      setError('Recipient email cannot be the same as sender email');
      setSuccess('');
      return;
   }
    try {
      // Send POST request to backend API to create the email
      await axios.post('http://localhost:5000/api/emails', {
        sender: userEmail,
        recipient,
        subject,
        body
      });
      // Save recipient value in localStorage
      localStorage.setItem('recipientEmail', recipient);
      // Clear form fields after successful submission
      setRecipient('');
      setSubject('');
      setBody('');
      setError('');
      setSuccess('Email successfully sent');
    } catch (err) {
      setError(err.response.data.error || 'Failed to send email');
      setSuccess('');
    }
  };
  

  useEffect(() => {
    if (success) {
      // Redirect to the ListEmails component after a delay
      const timer = setTimeout(() => {
        navigate('/emails');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Send Email</Title>
        {error && <Message error>{error}</Message>}
        {success && <Message>{success}</Message>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Recipient Email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            required
          />
          <Button type="submit">Send</Button>
        </Form>
      </Container>
    </>
  );
};

export default SendEmail;
