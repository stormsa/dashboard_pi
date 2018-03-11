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
            slug: "",
            colorTraffic: "green",
            schedules: [],
            divStyle: {
                backgroundColor: 'green'
            }
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
            .then(data => {
                this.setState({
                    title: data.result.title,
                    message: data.result.message,
                    slug: data.result.slug
                })

                if (this.state.slug !== "normal") {
                    this.setState({
                        divStyle: {
                            backgroundColor: 'green'
                        }
                    })
                }
            })
    }
    getHoraire() {
        fetch(API + DATA_TYPES[0] + "/" + this.transportType + "/" + this.line + "/" + this.station + "/" + this.way)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    schedules: data.result.schedules
                })

            })

    }
    componentDidUpdate(props){
        console.log("component update")
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
          let time = props.message.split(":")

          let timeBT = diff_minutes(time);
          return (
              <div className="row">
                  <div className="col-md-6 col-6">{props.destination}</div>
                  <div className="col-md-6 col-6">{props.message} ({timeBT} mn) </div>
              </div>
          )
      }
       const diff_minutes = function(time)
      {
          let date = new Date;
          let minutes = date.getMinutes();
          let hour = date.getHours();
          while(parseInt(time[0]) > parseInt(hour)){
              time[1] = parseInt(time[1]) + 60;
              hour++;
          }
          if(parseInt(time[1])> parseInt(minutes)){
              return (time[1] - minutes)
          }
      }
    return (
      <div className="APP RATP">
          <div style={this.state.divStyle} className="row"><b>{this.line} {this.station} </b> <button className="fa fa-refresh"> </button></div>
          <span className="row"> {this.state.slug !== "normal" ? this.state.message : ""}</span>
          <div className="row">
              <div className="col-md-6 col-6">Destination</div>
              <div className="col-md-6 col-6">Temps</div>
          </div>
          <div>
              {this.state.schedules.map(eachSchedule)}
          </div>
      </div>
    );
  }
}

export default Ratp;
