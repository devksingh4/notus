import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import notuswhite from './notus-white.png';
import { Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

export class ScreenHeader extends Component {
    render() {
      return (
        <div style={{display: 'flex', flex: 1, height: '6vh', padding: '1vh', fontSize: '2vh', border: 0, margin: 0, backgroundColor: "#005faf", color: "#ffffff", flexDirection: 'row'}}>
            <div style={{marginRight: 5}}><Link to="/"><MdArrowBack style={{color: '#ffffff'}}/></Link></div>
            <Link to="/"><div><img src={notuswhite} style={{ height: 30, marginLeft: 5, marginRight: 10 }}></img></div></Link>
            <p style={{fontSize: '2.5vh'}}>{this.props.name}</p>
        </div>
      );
    }
  }