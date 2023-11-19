import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation({ color }) {
  return (
    <>
      <Navbar>
        <Container className="font-serif font-georgia">
          <Navbar.Brand href="/" style={{ padding: "0", margin: "", position: 'absolute', top: '25px', left: '50px'}}>
            <img
              src="/images/logo.png" // Correct path for images in the public folder
              alt="Logo"
              style={{
                height: '80px', // Set the size as per your requirement
                width: '80px'
              }}
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;

