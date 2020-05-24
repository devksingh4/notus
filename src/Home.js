import React from 'react';
import { Bricks } from './Brick'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
function Home() {
  return (
    <div className="Home">
      <Jumbotron fluid style={{ backgroundColor: "#005faf" }}>
        <Container>
          <h1 style={{ color: '#ffffff' }}>Notus</h1>
          <p style={{ color: '#ffffff' }}>Modeling the spread of COVID-19 in various room layouts</p>
        </Container>
      </Jumbotron>
      <Container>
        <Bricks props={[{ name: "Designer" }, { name: "Configurator" }]} />
      </Container>
    </div>
  );
}

export default Home;
