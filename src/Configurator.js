import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.css';
import { ScreenHeader } from './Header';
const fs = window.require('fs');

export default class Configurator extends Component {
  componentWillMount() {
    this.setDefaults();
    return true; 
  }
  setDefaults = () => {
    this.setState({n_employees: 20, percent_infected: 5, percent_noncompliant: 5, social_distance: 6, p_infect: 1, cowr: .47, dispersal: .1, half_life: 360, n_cough: 1000, v_cough: 1})
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
    return true;
  }
  render() {
    return (
      <div className="Configurator" style={{ backgroundColor: "#28292d", height: "100vh"}}>
      <ScreenHeader name="Configurator"></ScreenHeader>
      <Container>
        <Card style={{padding: 20, margin: 20}}>
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
        <hr/>
        <i>The following options set advanced features of the model and will not change often.</i> <br/><br/>
        <Form.Group>
          <Form.Label>Probability of Infection (1e-4)</Form.Label>
          <Form.Control id="p_infect" type="number" value={this.state.p_infect} onChange={this.handleChange} placeholder={this.state.p_infect} />
          <Form.Label>Coefficent of particle wind resistance</Form.Label>
          <Form.Control id="cowr" type="number" value={this.state.cowr} onChange={this.handleChange} placeholder={this.state.cowr} />
          <Form.Label>Replusion of SARS-CoV-2 particles from each other</Form.Label>
          <Form.Control id="dispersal" type="number" value={this.state.dispersal} onChange={this.handleChange} placeholder={this.state.dispersal} />
          <Form.Label>Half life of SARS-CoV-2 particles</Form.Label>
          <Form.Control id="half_life" type="number" value={this.state.half_life} onChange={this.handleChange} placeholder={this.state.half_life} />
          <Form.Label>Particles of SARS-CoV-2 released in one cough</Form.Label>
          <Form.Control id="n_cough" type="number" value={this.state.n_cough} onChange={this.handleChange} placeholder={this.state.n_cough} />
          <Form.Label>Velocity of released particles</Form.Label>
          <Form.Control id="v_cough" type="number" value={this.state.v_cough} onChange={this.handleChange} placeholder={this.state.v_cough} />
        </Form.Group>
        <br/>
        <Button style={{backgroundColor: "#005faf", border: 0}} onClick={this.applyChanges}>
          Save
        </Button>    
        <span>     </span>    
        <Button style={{backgroundColor: "#af0000", border: 0}} onClick={this.setDefaults}>
          Reset to Defaults
        </Button>
      </Form>
      </Card>
    </Container>
    </div>
  );
  }
}