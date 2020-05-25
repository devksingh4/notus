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
    this.state= {
      loaderActive: false, 
      vizActive: false, 
      etaActive: false,
      iterTime: 1000, //ms
      iterAmt: 5,
      simData: {overallScore: 0, nearPasses: 0.05}
    }
  }

  componentDidMount() {
    eventEmitter.on("startloader", () => {
      this.setState({
        loaderActive: true,
        etaActive: false
      })
    });
    eventEmitter.on("stoploader", (metrics) => {
      this.setState({
        loaderActive: false,
        etaActive: false
      })
      eventEmitter.emit("startviz")
    });
    eventEmitter.on("probInfect", (metrics) => {
      if (!metrics.success) {
        this.setState({
          loaderActive: false,
          vizActive: false
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
    eventEmitter.on("timeTake", (time) => {
      this.setState({
        iterTime: time,
      })
      eventEmitter.emit("starteta");
    });
    eventEmitter.on("starteta", (time) => {
      this.setState({
        etaActive: true,
      })
    });
  }

  closeViz() {
    eventEmitter.emit("stopviz")
  }

  render() {
    let emojiProb;
    let messageProb;
    let emojiNearPasses;
    let messageNearPasses;
    if (this.state.simData.prob <= 1 && this.state.simData.prob > 0.01) {
      emojiProb = <Emoji size={128} text=":frowning:" style={{color: "#ff0000", fontSize: "3em"}}/>
      messageProb = <i>Employees have a high probability of contracting COVID-19 in this arrangement.</i>
    } else {
      emojiProb = <Emoji size={128} text=":smile:" style={{color: "#20CC82", fontSize: "3em"}}/>
      messageProb = <div><i>Employees have a low probability of contracting COVID-19 in this arrangement.</i></div>
    }
    if (this.state.simData.nearPasses <= 0.05) {
      emojiNearPasses = <Emoji size={128} text=":smile:" style={{color: "#20CC82", fontSize: "3em"}}/>
      messageNearPasses = <div><i>Employees will not be forced to break social distancing guidelines very often in this arrangement.</i></div>
    } else {
      emojiNearPasses = <Emoji size={128} text=":frowning:" style={{color: "#ff0000", fontSize: "3em"}}/>
      messageNearPasses = <div><i>Employees will be forced to break social distancing guidelines very often in this arrangement.</i></div>
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
        {this.state.loaderActive ? <div className="loader">
          <div>
            <div className="lds-grid">
              <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <div className="loaderText">
              <p>Modeling (this may take some time)</p>
            </div>
            {this.state.etaActive ? <div className="loaderText">
              <p>ETA count</p>
            </div> : null}
          </div>
        </div> : null}
        {this.state.vizActive ? <div className="vizview">
          <Container className="vizcard" style={{backgroundColor: 'white'}}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <div>
                  <h3>Results:</h3>
                </div>
              </ListGroup.Item>
              <ListGroup.Item>{emojiProb} Employee Probability of Infection: {this.state.simData.prob * 100}% <br/> {messageProb}</ListGroup.Item> {/*TODO: Add the actual values*/}
              <ListGroup.Item>{emojiNearPasses} Encounters forced to break social distancing: {this.state.simData.nearPasses * 100}% <br/> {messageNearPasses}</ListGroup.Item> {/*TODO: Add the actual values*/}
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

ipcRenderer.on('iterTime', (event, time) => {
  eventEmitter.emit("timeTake", time)
})


export default Designer;
