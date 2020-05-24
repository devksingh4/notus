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
        group.push(<Link to={this.props.props[i].name.toLowerCase()}>
          <Card style={{margin: 20}}>
            <Card.Body>
              <Card.Title style={{color: '#005faf'}}>{this.props.props[i].name}</Card.Title>
              <Card.Text style={{color: '#005faf'}}>Enter the room {this.props.props[i].name.toLowerCase()}.</Card.Text>
            </Card.Body>
          </Card>
        </Link>)
      }
      return group
    }
    render() {
      return (
        <div aria-label="Property chooser">
          {this.createGroup()}
        </div>
      );
    }
}

