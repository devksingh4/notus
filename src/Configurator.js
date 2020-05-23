import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css';
import { ScreenHeader } from './Header';
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

export default class Configurator extends Component {
  constructor(props) {
    super(props)
    this.state = {} // default values and original values
    // this.handleChange1 = this.handleChange1.bind(this); // bind change listener to the element which runs that on change
  }
  componentDidMount = () => {
    // this.setState({}) default values for the form. 
    // get the current values from config.json
  }
  render() {
    return (
      <div className="Configurator">
      <ScreenHeader name="Configurator"></ScreenHeader>
      <Container>
        <Form>
        <Form.Group controlId="">
          <Form.Label>Item 1</Form.Label>
          <Form.Control type="number" min="0" max="100" value={this.state.item1} onChange={this.handleChange1} placeholder={this.state.orig1} />
        </Form.Group>
        <Button variant="primary" onClick={this.applyChanges}>
          Submit
        </Button>    
        <span>     </span>    
        <Button variant="danger" onClick={this.setDefaults}>
          Reset to Defaults
        </Button>
      </Form>
    </Container>
    </div>
  );
  }
}
