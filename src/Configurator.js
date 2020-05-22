import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';

function Configurator() {
  return (
    <div className="Configurator">
      <Jumbotron fluid>
        <Container>
          <h1>Room Configurator</h1>
          <p></p>
        </Container>
      </Jumbotron>
    </div>
  );
}

export default Configurator;
