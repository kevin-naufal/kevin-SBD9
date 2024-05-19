import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: #D3CCCB;
    font-family: Arial, sans-serif;
  }
`;

// Container for the entire component
const Container = styled.div`
  display: flex;
  padding: 20px;
  height: 100vh; /* Ensure full viewport height */
`;

// Container for the side buttons and user info with preset size
const SideContainer = styled.div`
  background: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  width: 250px; /* Preset width */
  height: 100%; /* Full height of the container */
`;

// User email style
const UserEmail = styled.p`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

// Button style
const Button = styled.button`
  background-color: #333;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-bottom: 10px;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #444;
  }
`;

// Define the styled logout button
// Define the styled logout button
const LogoutButton = styled(Button)`
  background-color: #E62525;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin-bottom: 10px;
  margin-top: 400px;
  width: 100%;
  text-align: center;
  

  &:hover {
    background-color: #990000;
  }
`;



// Container for email lists with scrollable content
const EmailListContainer = styled.div`
  flex: 1;
  overflow-y: auto; /* Enable vertical scrolling */
  padding-right: 10px; /* Add padding to avoid content being hidden by scrollbar */
  height: calc(100vh - 40px); /* Adjust height based on padding */
`;

// Email item style
const EmailItem = styled.li`
  background: #1e1e1e;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

// Email header style
const EmailHeader = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.1em;
`;

// Email body style with ellipsis
const EmailBody = styled.p`
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Delete and Update button styles
const ActionButton = styled.button`
  background: none;
  border: none;
  border: 1px solid #444;
  padding: 5px 10px; /* Added padding */
  color: ${props => (props.delete ? '#FFFFFF' : '#FFFFFF')}; /* Darker color for delete and update buttons */
  background-color: ${props => (props.delete ? '#E62525' : '#2764a5')}; /* Red for delete, blue for update */
  cursor: pointer;
  margin-right: 10px;
  border-radius: 5px;
  font-size: 0.9em; 

  &:hover {
    background-color: ${props => (props.delete ? '#990000' : '#003366')}; /* Dark red for delete, dark blue for update */
  }
`;
const ListEmails = () => {
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [displayReceived, setDisplayReceived] = useState(true);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const receivedResponse = await axios.get(`http://localhost:5000/api/emails/recipient/${userEmail}`);
        setReceivedEmails(receivedResponse.data);
        
        const sentResponse = await axios.get(`http://localhost:5000/api/emails/sender/${userEmail}`);
        setSentEmails(sentResponse.data);
      } catch (err) {
        console.error('Error fetching emails:', err);
      }
    };

    fetchEmails();
  }, [userEmail]);

  const handleSendEmailClick = () => {
    navigate('/send'); // Navigate to the SendEmail component
  };

  const handleDeleteEmail = async (event, id) => {
    event.preventDefault(); // Prevent default navigation behavior
    try {
      await axios.delete(`http://localhost:5000/api/emails/${id}`);
      setReceivedEmails(receivedEmails.filter(email => email.id !== id));
      setSentEmails(sentEmails.filter(email => email.id !== id));
    } catch (err) {
      console.error('Error deleting email:', err);
    }
  };
  

  const handleUpdateEmail = (event, id) => {
    event.preventDefault(); // Prevent default navigation behavior
    navigate(`/update/${id}`); // Navigate to the UpdateEmail component with email ID as parameter
  };
  
  // Logout function to clear user session
  const handleLogout = () => {
    // Navigate to the home page or login page
    navigate('/');
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <SideContainer>
          <UserEmail>{userEmail}</UserEmail>
          <Button onClick={() => setDisplayReceived(true)}>Received Emails</Button>
          <Button onClick={() => setDisplayReceived(false)}>Sent Emails</Button>
          <Button onClick={handleSendEmailClick}>Compose</Button>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </SideContainer>
        <EmailListContainer>
          {displayReceived ? (
            <div>
              <h1 style={{ marginBottom: '20px' }}>Received Emails</h1>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {receivedEmails.map(email => (
                  <Link to={`/emails/${email.id}`} key={email.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <EmailItem>
                      <EmailHeader>from: {email.sender.split('@')[0]}</EmailHeader>
                      <EmailBody>
                        <strong>{email.subject}</strong> - "{email.body}"
                      </EmailBody>
                      <div style={{ marginTop: '10px' }}>
                        <ActionButton delete onClick={(event) => handleDeleteEmail(event, email.id)}>Delete</ActionButton>
                        {email.subject && <ActionButton onClick={(event) => handleUpdateEmail(event, email.id)}>Update</ActionButton>}
                      </div>
                      <EmailHeader style={{ textAlign: 'right', marginRight: '10px' }}>
                        {new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </EmailHeader>
                    </EmailItem>
                  </Link>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <h1 style={{ marginBottom: '20px' }}>Sent Emails</h1>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {sentEmails.map(email => (
                  <Link to={`/emails/${email.id}`} key={email.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <EmailItem>
                      <EmailHeader>to: {email.recipient.split('@')[0]}</EmailHeader>
                      <EmailBody>
                        <strong>{email.subject}</strong> - "{email.body}"
                      </EmailBody>
                      <div style={{ marginTop: '10px' }}>
                        <ActionButton delete onClick={(event) => handleDeleteEmail(event, email.id)}>Delete</ActionButton>
                        {email.subject && <ActionButton onClick={(event) => handleUpdateEmail(event, email.id)}>Update</ActionButton>}
                      </div>
                      <EmailHeader style={{ textAlign: 'right', marginRight: '10px' }}>
                        {new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </EmailHeader>
                    </EmailItem>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </EmailListContainer>
      </Container>
    </>
  );
};

export default ListEmails;