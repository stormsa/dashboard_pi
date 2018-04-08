import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './Dashboard.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-responsive-carousel/lib/styles/carousel.css';
import Ratp from "./Components/Ratp";
import {Carousel} from 'react-responsive-carousel';
import Weather from "./Components/Weather";
import Plant from "./Components/Plant";

// RATP CONSTANTES
const TRANSPORT_TYPE = ["rers", "metro"]
const LINES= ["A", "B", "1", "2", "3", "3b", "4", "5", "6", "7", "7b","8", "9", "10", "12", "13", "14"]
const CITY = ["Paris","Le Havre","Orleans","Lyon","Nice","Nantes","Bordeaux","Marseille","Toulouse","Rennes","Reims","Rouen"]

class Dashboard extends Component {
    constructor(){
        super()
        this.state = {
            plantes: []
        }
    }
    componentDidMount(){
        fetch("/plant/all")
            .then(response => response.json)
            .then(data =>{
                this.setState({
                    plantes: data.result
                })
            })
    }
  render() {
      const eachPlant = function(plant){
          return (
              <div>
                  <Plant    key={plant.id}
                            name={plant.name}
                            instruction={plant.instruction}
                            description={plant.description}
                            lastArrosage={plant.lastArrosage}>
                  </Plant>
                  <p className="legend">{plant.name}</p>
              </div>
          )
      }
    return (
        <div className="container">
            <Carousel showArrows={true} showThumbs={false} onClickItem={console.log("hello")}>
                <div>
                    <Ratp transportType={TRANSPORT_TYPE[0]} line={LINES[0]} walkTime="13" station="Le Parc De Saint Maur" way="A"/>
                    <p className="legend">RATP APP</p>
                </div>
                <div>
                    <Weather city={CITY[0]}/>
                    <p className="legend">Weather APP</p>
                </div>
                {this.state.plantes.map(eachPlant)}
            </Carousel>
        </div>

    );
  }
}
export default Dashboard
