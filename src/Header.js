import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import { MdArrowBack } from 'react-icons/md';

export class ScreenHeader extends Component {
    render() {
      return (
        <div aria-label="Screen Header">
            <Jumbotron fluid>
                <Container>
                    <Link to="/"><MdArrowBack/></Link>
                    <h1>{this.props.name}</h1>
                    <p>{this.props.description}</p>
                </Container>
            </Jumbotron>
        </div>
      );
    }
  }