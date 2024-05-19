import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #f0f0f0;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #fff;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  resize: vertical;
  background-color: #5E5C5C;
  color: #E3DCDC;
`;

const EmailDetails = () => {
  const { id } = useParams();
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/emails/${id}`);
        const email = response.data;

        // Remove @gmail.com from sender and recipient and capitalize the first letter
        const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1);
        const senderName = capitalize(email.sender.split('@')[0]);
        const recipientName = capitalize(email.recipient.split('@')[0]);

        const content = `Dear ${recipientName},

${email.body}

Best regards, 
${senderName}
        `;
        setEmailContent(content);
        setSubject(email.subject);
      } catch (err) {
        console.error('Error fetching email:', err);
      }
    };

    fetchEmail();
  }, [id]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>{subject}</Title>
        <Textarea value={emailContent} readOnly rows={12} />
      </Container>
    </>
  );
};

export default EmailDetails;
