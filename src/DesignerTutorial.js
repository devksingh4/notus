import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.css';
import { ScreenHeader } from './Header';
import notushead from './notus-doozy.png';
import selectconfig from './tutorial-images/selectconfig.png';
import basicconfig from './tutorial-images/basicconfig.png';
import advancedconfig from './tutorial-images/advancedconfig.png';
import selectdesigner from './tutorial-images/selectdesigner.png';
import designer1 from './tutorial-images/designer1.png';
import designer2 from './tutorial-images/designer2.png';
import designer3 from './tutorial-images/designer3.png';
import designer4 from './tutorial-images/designer4.png';
import designer5 from './tutorial-images/designer5.png';
import designer6 from './tutorial-images/designer6.png';
import designer7 from './tutorial-images/designer7.png';
import designer8 from './tutorial-images/designer8.png';
import designer9 from './tutorial-images/designer9.png';

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
          <Card.Img src={notushead} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
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
          <Card.Img src={selectconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Title>Basic Configuration</Card.Title>
          <Card.Img src={basicconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Title>Advanced Configuration</Card.Title>
          <Card.Img src={advancedconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Using the designer</Card.Header>
        <Card.Body>
          <Card.Img src={selectdesigner} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Title>Drawing your office</Card.Title>
          <Card.Img src={designer1} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer2} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer3} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer4} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer5} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Title>Viewing the room in 3D</Card.Title>
          <Card.Img src={designer6} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer7} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Title>Modeling the spread</Card.Title>
          <Card.Img src={designer8} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
          <Card.Img src={designer9} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text></Card.Text>
        </Card.Body>
      </Card>
      <br/>
    </Container>
    </div>
  );
  }
}