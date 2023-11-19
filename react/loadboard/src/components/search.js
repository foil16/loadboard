import React from 'react';
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

export default function Searchbar() {
  return (
    <MDBInputGroup className="mdb-input-group">
    <MDBInput label='Search' className="select-trucker" id="select-trucker"/>
    <MDBBtn rippleColor='dark' className="search-button">
    <MDBIcon fas icon='search' className="search-icon" />
  </MDBBtn>
  </MDBInputGroup>
  );
}