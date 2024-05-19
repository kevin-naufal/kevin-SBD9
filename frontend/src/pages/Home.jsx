import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e; /* Dark background color */
  text-align: center;
`;


const Content = styled.div`
  display: inline-block;
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
`;

const Title = styled.h1`
  font-size: 3em;
  color: #e0e0e0; /* White text color */
  font-weight: bold; /* Bold font weight */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const Button = styled.button`
  background-color: #2764a5;
  border: none;
  color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-right: 10px;

  &:hover {
    background-color: #1d4f7b;
  }
`;

const Home = () => {
  return (
    <Container>
      <Content>
        <Title>Welcome to Yipee!</Title>
        <ButtonContainer>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button>Login</Button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button>Sign Up</Button>
          </Link>
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Home;
