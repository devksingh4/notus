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
            <i>Notus is a tool that helps rate office layouts on the spread of COVID-19.</i>
            <p>
              These office layouts are defined by you. Notus uses intuitive room-planning
              tools and a powerful Monte Carlo simulator to give you relevant results.
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Configuring Notus</Card.Header>
        <Card.Body>
          <Card.Text>The Notus Monte Carlo simulation in configured in the Configurator screen.</Card.Text>
          <Card.Img src={selectconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Enter the Configurator by clicking the highlighted region above.</Card.Text>
          <Card.Title>Basic Configuration</Card.Title>
          <Card.Img src={basicconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>You can edit some basic parameters of the Monte Carlo simulation here. These should
            usually change with your office layout and employee count.
          </Card.Text>
          <Card.Title>Advanced Configuration</Card.Title>
          <Card.Img src={advancedconfig} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>You rarely need to change these parameters of the simulation. These parameters 
            control how COVID-19 behaves in the simulation. You may change these as new data becomes available on the spread of COVID-19.
          </Card.Text>
          <Card.Text>After configuring the simulation, you can save using the <i>Save</i> button or 
            reset the parameters using the <i>Reset to Defaults</i> button. Exit this screen by 
            clicking the back arrow or Notus logo on the upper left of the application.
          </Card.Text>
        </Card.Body>
      </Card>
      <br/>
      <Card bg='light'>
        <Card.Header as="h5">Using the designer</Card.Header>
        <Card.Body>
          <Card.Text>The room layout is set in the Designer screen. The Designer is also where you
            start the Monte Carlo simulation.
          </Card.Text>
          <Card.Img src={selectdesigner} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Enter the Configurator by clicking the highlighted region above.</Card.Text>
          <Card.Title>Drawing your room layout</Card.Title>
          <Card.Text>In order to draw your room layout, you must use elements from the Notus catalog.</Card.Text>
          <Card.Img src={designer1} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Open the catalog by clicking the highlighted region above.</Card.Text>
          <Card.Text>The Notus catalog contains many elements related to office environments.</Card.Text>
          <Card.Img src={designer2} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Walls are required to specify rooms to be simulated. Select the wall element
            by clicking the highlighted region above.
            </Card.Text>
          <Card.Text>Click on the locations on the grid where you want segments of wall to be located.
            An area surrounded by wall automatically becomes a room.
          </Card.Text>
          <Card.Img src={designer3} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>To exit from the construction of walls, press the escape key.</Card.Text>
          <Card.Text>You may use the Notus catalog to add other elements, such as doors, windows, desks, 
            and air intakes and outflows. Note that windows are modeled as objects that are permeable to 
            COVID-19, so do not draw windows in locations where they are permanently closed.
          </Card.Text>
          <Card.Img src={designer4} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Populate the rest of your rooms with elements from the Notus catalog.</Card.Text>
          <Card.Text>Sometimes it may be necessary to rotate an element.</Card.Text>
          <Card.Img src={designer5} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>In order to do this, press the escape key after placing the element. A gizmo will 
            appear, which is highlighted above. Click and drag the gizmo in order to rotate the element.
          </Card.Text>
          <Card.Title>Viewing the room in 3D</Card.Title>
          <Card.Text>Notus comes equipped with a 3D view in the room designer.</Card.Text>
          <Card.Img src={designer6} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>In order to use it, click the <i>3D</i> icon, which is highlighted above.</Card.Text>
          <Card.Img src={designer7} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>You can navigate the 3D view by using the left mouse button to orbit, the right 
            mouse button to pan, and the middle mouse button or scroll wheel to zoom.
          </Card.Text>
          <Card.Title>Modeling the spread</Card.Title>
          <Card.Text>Running the Notus Monte Carlo simulator is done through the room designer.</Card.Text>
          <Card.Img src={designer8} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>Start the simulator by clicking the icon highlighted above.</Card.Text>
          <Card.Text>After a short loading screen, Notus will display metrics produced by the simulation.</Card.Text>
          <Card.Img src={designer9} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 20, objectFit: 'contain'}}></Card.Img>
          <Card.Text>These metrics may help you improve the layout of your rooms against the spread of COVID-19.</Card.Text>
        </Card.Body>
      </Card>
      <br/>
    </Container>
    </div>
  );
  }
}