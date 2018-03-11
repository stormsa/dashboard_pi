import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-responsive-carousel/lib/styles/carousel.css';
import Ratp from "./Components/Ratp";
import {Carousel} from 'react-responsive-carousel';

// RATP CONSTANTES
const TRANSPORT_TYPE = ["rers", "metro"]
const LINES= ["A", "B", "1", "2", "3"]

class Dashboard extends Component {
    constructor(props){
        super(props)
    }
  render() {
    return (
        <div className="container">
            <Carousel showArrows={true} onClickItem={console.log("hello")}>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Le+Parc+De+Saint+Maur" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Auber" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Saint+Maur+Creteil" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Le+Parc+De+Saint+Maur" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Le+Parc+De+Saint+Maur" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} station="Le+Parc+De+Saint+Maur" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
            </Carousel>
        </div>

    );
  }
}
export default Dashboard
