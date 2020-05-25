import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import { ScreenHeader } from './Header';
import notushead from './notus-doozy.png'

export default class DesignerTutorial extends Component {
  render() {
    return (
      <div className="DesignerTutorial">
      <ScreenHeader name="Designer Tutorial"></ScreenHeader>
      <Container>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Getting Started</Card.Header>
        <Card.Body>
          <Card.Img src={notushead} style={{maxHeight: 200, margin: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Title>What is Notus?</Card.Title>
          <Card.Text>
            <i>Notus is a tools that helps rate office layouts on the spread of COVID-19.</i>
            <p>
              These office layouts are defined by you, the user. Notus uses intuitive room-planning
              tools and a powerful Monte Carlo simulator to give you relevant results.
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Configuring Notus</Card.Header>
        <Card.Body>
          <Card.Title>Basic Configuration</Card.Title>
          <Card.Text></Card.Text>
          <Card.Title>Advanced Configuration</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Using the designer</Card.Header>
        <Card.Body>
          
          <Card.Title>Drawing your office</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Body>
          <Card.Title>Viewing the room in 3D</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Body>
          <Card.Title>Modeling the spread</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
    </Container>
    </div>
  );
  }
}