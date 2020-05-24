import React from 'react';
import { Bricks } from './Brick'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import './index.css'

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
        <Bricks 
          props={[
            { name: "Designer", description: "Enter the room designer" }, 
            { name: "Configurator", description: "Set the number of employees, social distance, and other aspects of the model"}, 
            { name: "DesignerTutorial", description: "Learn how to use Notus" }]} 
        />
      </Container>
    </div>
  );
}

export default Home;
