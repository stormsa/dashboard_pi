import React, { Component } from 'react';
import logo from './logo.svg';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.css';
import Ratp from "./Components/Ratp";

// RATP CONSTANTES
const TRANSPORT_TYPE = ["rers", "metro"]
const LINES= ["A", "B", "1", "2", "3"]

class Dashboard extends Component {
    constructor(props){
        super(props)
    }
  render() {
    return (
      <div className="Dashboard container">
          <div className="row">
              <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Le+Parc+De+Saint+Maur" way="A"/>
              <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Auber" way="A"/>
          </div>

      </div>
    );
  }
}

export default Dashboard;
