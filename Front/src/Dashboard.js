import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-responsive-carousel/lib/styles/carousel.css';
import Ratp from "./Components/Ratp";
import {Carousel} from 'react-responsive-carousel';
import Weather from "./Components/Weather";
import Bulb from "./Components/Bulb";
let Config = require('Config');

// RATP CONSTANTES
let transportConfig = Config.ratp
const transport_type = transportConfig.TRANSPORT_TYPE.PossibleValues[transportConfig.TRANSPORT_TYPE.choosenIndex]
const line= transportConfig.LINES.PossibleValues[transportConfig.LINES.choosenIndex]
const walktime= transportConfig.WalkToStation
const station = transportConfig.Station
const way = transportConfig.Way.choice
const city = Config.weather.City.PossibleValues[Config.weather.City.choosenIndex]

class Dashboard extends Component {
    render() {
        return (
            <div className="container">
                <Carousel showArrows={true} showThumbs={false}>
                    <div>
                        <Ratp transportType={transport_type} line={line} walkTime={walktime} station={station} way={way}/>
                        <p className="legend">RATP APP</p>
                    </div>
                    <div>
                        <Weather city={city}/>
                        <p className="legend">{city} Weather</p>
                    </div>
                    <div>
                        <Bulb/>
                        <p className="legend">Ampoule Yeelight</p>
                    </div>
                </Carousel>
            </div>
        )
    }
}
export default Dashboard
