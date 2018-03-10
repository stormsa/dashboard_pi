import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

const API = "https://api-ratp.pierre-grimaud.fr/v3";
const DATA_TYPES = ["/schedules", "/traffic"]
class Ratp extends Component {
    // A RATP COMPONENT will be use to display an horaire for a specific data
    constructor(props){
        super(props)
        this.state = {
            title: "Chargement en cours",
            message: "",
            schedules: []
        }
        this.getTraffic = this.getTraffic.bind(this)
        this.getHoraire = this.getHoraire.bind(this)
        this.station = props.station
        this.way = props.way
        this.line = props.line
        this.destination = props.destination
        this.transportType = props.transportType
    }
    componentDidMount(){
        this.getTraffic()
        this.getHoraire()
    }
    getTraffic() {
        fetch(API + DATA_TYPES[1]+"/"+ this.transportType + "/"+this.line)
            .then(response => response.json())
            .then(data => this.setState({
                title: data.result.title,
                message: data.result.message
            })
            )
    }
    getHoraire() {
        fetch(API + DATA_TYPES[0] + "/" + this.transportType + "/" + this.line + "/" + this.station + "/" + this.way)
            .then(response => response.json())
            .then(data => {
                console.log(data.result.schedules)
                this.setState({
                    schedules: data.result.schedules
                })

            })

    }
  render() {
      const eachSchedule = function(schedule){
          return (
              <Schedule destination={schedule.destination}
                        message={schedule.message}>
              </Schedule>
          )
      }
      const Schedule = function(props){
          return (
              <div>
                Prochain train : {props.destination} {props.message}
              </div>
          )
      }
    return (
      <div className="RATP col-md-4">
          <span>{this.line} {this.station} : {this.state.title}</span>
          <span> {this.state.message}</span>
          <div>
              {this.state.schedules.map(eachSchedule)}
          </div>
      </div>
    );
  }
}

export default Ratp;
