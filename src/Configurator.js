import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css';
import { ScreenHeader } from './Header';
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;
const fs = window.require('fs');

export default class Configurator extends Component {
  componentWillMount() {
    this.setDefaults();
    return true; 
  }
  setDefaults = () => {
    this.setState({n_employees: 20, percent_infected: 5, percent_noncompliant: 5, social_distance: 6})
    return true;
  }
  handleChange = (e) => {
    this.setState({[e.target.id]: e.target.value})
    return true;
  }
  applyChanges = () => {
    fs.writeFile('model-config.json', JSON.stringify(this.state), function (err) {
      if (err) throw err;
      alert('Saved!')
    });
  }
  render() {
    return (
      <div className="Configurator">
      <ScreenHeader name="Configurator"></ScreenHeader>
      <Container>
        <Form>
        <Form.Group>
          <Form.Label>Number of employees</Form.Label>
          <Form.Control id="n_employees" type="number" min="0" value={this.state.n_employees} onChange={this.handleChange} placeholder={this.state.n_employees} />
          <Form.Label>Percent of employees infected</Form.Label>
          <Form.Control id="percent_infected" type="number" min="0" max="100" value={this.state.percent_infected} onChange={this.handleChange} placeholder={this.state.percent_infected} />
          <Form.Label>Percent of employees non-compliant with social distancing guidelines</Form.Label>
          <Form.Control id="percent_noncompliant" type="number" min="0" max="100" value={this.state.percent_noncompliant} onChange={this.handleChange} placeholder={this.state.percent_noncompliant} />
          <Form.Label>Social Distance (employees should stay this many feet away from each other)</Form.Label>
          <Form.Control id="percent_noncompliant" type="number" min="0" max="100" value={this.state.social_distance} onChange={this.handleChange} placeholder={this.state.social_distance} />
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
