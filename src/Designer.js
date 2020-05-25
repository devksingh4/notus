import React from 'react';
import Dimensions from 'react-dimensions'
import MyCatalog from './catalog/mycatalog';
import { Map } from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import './index.css'
import { ScreenHeader } from './Header'
import ListGroup from 'react-bootstrap/ListGroup'
import Emoji from "react-emoji-render";

// import {
//   Models as PlannerModels,
//   reducer as PlannerReducer,
//   ReactPlanner,
//   Plugins as PlannerPlugins,
// } from '/home/dsingh/source/react-planner';

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner-electron';

const { ipcRenderer } = window.require('electron')
const events = require('events');
const eventEmitter = new events.EventEmitter();

class MyPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state= {loaderActive: false, vizActive: false, simData: {overallScore: 0}}
  }

  componentDidMount() {
    eventEmitter.on("startloader", () => {
      this.setState({
        loaderActive: true,
      })
    });
    eventEmitter.on("stoploader", (metrics) => {
      this.setState({
        loaderActive: false,
      })
      eventEmitter.emit("startviz")
    });
    eventEmitter.on("probInfect", (metrics) => {
      if (!metrics.success) {
        this.setState({
          loaderActive: false,
          vizActive: false,
        })
      } else {
        this.setState({simData: metrics.data})
        eventEmitter.emit("stoploader");
      }
    })
    eventEmitter.on("startviz", () => {
      this.setState({
        vizActive: true,
      })
    });
    eventEmitter.on("stopviz", () => {
      this.setState({
        vizActive: false,
      })
    });
  }

  closeViz() {
    eventEmitter.emit("stopviz")
  }

  render() {
    let emojiScore;
    let message;
    let emojiProb;
    if (this.state.simData.overallScore <= 100 && this.state.simData.overallScore > 70) {
      emojiScore = <Emoji size={128} text=":smile:" style={{color: "#20CC82", fontSize: "3em"}}/>
      message = <i>Your office layout does a good job of suppressing the spread of COVID-19!</i>
    } else if (this.state.simData.overallScore <= 70 && this.state.simData.overallScore > 50) {
      emojiScore = <Emoji size={128} style={{color: "#ff6700", fontSize: "3em"}} text=":neutral_face:"/>
      message = <i>While your office layout does an acceptable job of suppressing the spread of COVID-19, improvements could be made.</i>
    } else {
      emojiScore = <Emoji size={128} style={{color: "#ff0000", fontSize: "3em"}} text=":frowning:"/>
      message = <i>Your office layout does not do a good job of suppressing the spread of COVID-19. Improvements must be made.</i>
    }
    if (this.state.simData.prob <= 1 && this.state.simData.prob > 0.20) {
      emojiProb = <Emoji size={128} text=":frowning:" style={{color: "#ff0000", fontSize: "3em"}}/>
    } else {
      emojiProb = <Emoji size={128} text=":smile:" style={{color: "#20CC82", fontSize: "3em"}}/>
    }
    return (
      <div>
        <ReactPlanner
          width={this.props.containerWidth}
          height={this.props.containerHeight}
          catalog={MyCatalog}
          plugins={plugins}
          stateExtractor={state => state.get('react-planner-electron')}
        />
        {this.state.loaderActive ? <div className="loader"><div><div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><p className="loaderText">Modeling</p></div></div> : null}
        {this.state.vizActive ? <div className="vizview">
          <Container className="vizcard" style={{backgroundColor: 'white'}}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div>
                  <h3>{emojiScore}Overall Score: {this.state.simData.overallScore}</h3>
                  {message}
                </div>
              </ListGroup.Item>
              <ListGroup.Item>{emojiProb} Employee Probability of Infection: {this.state.simData.prob * 100}%</ListGroup.Item> {/*TODO: Add the actual values.*/}
              <ListGroup.Item><Button onClick={this.closeViz} style={{backgroundColor: "#005faf", border: 0}}>Close</Button></ListGroup.Item>
            </ListGroup>
          </Container>
        </div> : null}
      </div>
    )
  }
}

const EnhancedPlanner = Dimensions({ elementResize: true, className: 'react-dimensions-wrapper', containerStyle: { height: '94vh', padding: 0, border: 0, margin: 0 } })(MyPlanner)

//define state
let AppState = Map({
  'react-planner-electron': new PlannerModels.State()
});

//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-planner-electron', plannerState => PlannerReducer(plannerState, action));
  return state;
};

let store = createStore(reducer, null, window.devToolsExtension ? window.devToolsExtension() : f => f);

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-planner-electron_v0'),
];
function Designer() {
  return (
    <div className="Designer" style={{ overflow: 'hidden' }}>
      <ScreenHeader name="Room Designer"></ScreenHeader>
      <Provider store={store}>
        <EnhancedPlanner />
      </Provider>
    </div>
  );
}

ipcRenderer.on('probInfect', (event, metrics) => {
  eventEmitter.emit("probInfect", metrics)
})

ipcRenderer.on('startloadscreen', (event) => {
  eventEmitter.emit("startloader")
})

export default Designer;
