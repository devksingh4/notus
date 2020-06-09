import React from 'react';
import { Bricks } from './Brick'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import notuswhite from './notus-white.png';
import './index.css'

function Home() {
  return (
    <div className="Home">
      <Jumbotron fluid style={{ backgroundColor: "#005faf" }}>
        <Container>
          <div className="flexrow">
            <div><img src={notuswhite} style={{ height: 100, marginLeft: 20, marginRight: 20 }}></img></div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ color: '#ffffff' }}>Notus</h1>
                <p style={{ color: '#ffffff', margin: 0 }}>Modeling the spread of COVID-19 in various room layouts</p>
              </div>
            </div>
          </div>
        </Container>
      </Jumbotron>
      <Container>
        <Bricks
          props={[
            { name: "Designer", description: "Enter the room designer" },
            { name: "Configurator", description: "Set the number of employees, social distance, and other aspects of the model" },
            { name: "Tutorial", description: "Learn how to use Notus" }]}
        />
      </Container>
    </div>
  );
}

export default Home;
