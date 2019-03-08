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
        const CarrouselStyle = {
            height: "100vh"

        };
        const DivStyle = {
            height: "350px",
            marginBottom: "10px"
        }

        let RatpDiv = function (props) {
            return (
                <div className="col-xs-12 col-md-6" style={props.style}>
                    <Ratp transportType={transport_type} line={line} walkTime={walktime}
                          station={station} way={way} style={props.style}/>
                    <p className="legend">{props.legend}</p>
                </div>
            )
        }
        let WeatherDiv = function (props) {
            return (
                <div className="col-xs-12 col-md-6" style={props.style}>
                    <Weather city={city} style={props.style}/>
                    <p className="legend">{props.legend}</p>
                </div>
            )
        }
        let BulbDiv = function (props) {
            return (
                <div className="col-xs-12 col-md-6" style={props.style}>
                    <Bulb style={props.style}/>
                    <p className="legend">{props.legend}</p>
                </div>
            )
        }

        let Display = function () {
            if (window.innerHeight < 500) {
                return <Carousel showArrows={true} showThumbs={false}>
                    <RatpDiv style={CarrouselStyle} legend={"RATP APP"}/>
                    <WeatherDiv style={CarrouselStyle} legend={city+"Weather"}/>
                    <BulbDiv style={CarrouselStyle} legend={"Ampoule Yeelight"}/>
                </Carousel>
            }
            else
                return <div className="row">
                    <RatpDiv style={DivStyle}/>
                    <WeatherDiv style={DivStyle}/>
                    <BulbDiv style={DivStyle}/>
                </div>
        }
        return (
            <div className="container">
                <Display/>
            </div>
        )
    }
}
export default Dashboard
