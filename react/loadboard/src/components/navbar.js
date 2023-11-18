import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Navigation({ color }) {
  return (
    <>
      <Navbar>
        <Container className="font-serif font-georgia">
          <Navbar.Brand
            href="/"
            style={{
              color: color,
              fontSize: '30px',
              padding: "0",
              margin: "0",
              textAlign: 'center',
              fontFamily:"times-new-roman"
            }}
          > Bhay Nom
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;