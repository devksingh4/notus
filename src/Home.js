import React from 'react';
import { Bricks } from './Brick'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
function Home() {
  return (
    <div className="Home">
      <Jumbotron fluid>
        <Container>
          <h1>COVID Room Designer</h1>
          <p>Modeling the spread of COVID-19 in various room layouts</p>
        </Container>
      </Jumbotron>
      <Bricks props={[{name: "Designer"}]}/>
    </div>
  );
}

export default Home;
