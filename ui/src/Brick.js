import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export class Bricks extends Component {
    // componentDidMount() {
    // }
  
    // componentWillUnmount() {
    // }
    createGroup = () => {
      let group = []
      for (let i = 0; i < this.props.props.length; i++) {
        group.push(<Link key={`${this.props.props[i].name.toLowerCase()}.Link`} to={this.props.props[i].name.toLowerCase()}>
          <Card key={`${this.props.props[i].name.toLowerCase()}`} style={{margin: 20}}>
            <Card.Body>
              <Card.Title key={this.props.props[i].name.toLowerCase().Title} style={{color: '#005faf'}}>{this.props.props[i].name.replace(/([A-Z])/g, ' $1')}</Card.Title>
              <Card.Text key={this.props.props[i].name.toLowerCase().Text} style={{color: '#005faf'}}>{this.props.props[i].description}</Card.Text>
            </Card.Body>
          </Card>
        </Link>)
      }
      return group
    }
    render() {
      return (
        <div aria-label="Property chooser" key={'opts'}>
          {this.createGroup()}
        </div>
      );
    }
}

