import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import { MdArrowBack } from 'react-icons/md';

export class ScreenHeader extends Component {
    render() {
      return (
        <div style={{ flex: 1, height: '8vh', padding: '1vh', fontSize: '2vh', border: 0, margin: 0, backgroundColor: "#005faf", color: "#ffffff", flexDirection: 'row'}}>
            
            <Container><Link to="/"><MdArrowBack style={{color: '#ffffff'}}/></Link><p style={{fontSize: '2.5vh'}}>{this.props.name}</p></Container>
        </div>
      );
    }
  }