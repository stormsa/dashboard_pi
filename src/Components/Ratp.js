import React, { Component } from 'react';
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
            times: [],
            divStyle: {
                backgroundColor: 'green',
                paddingLeft: "50px"
            }
        }
        this.getTraffic = this.getTraffic.bind(this)
        this.getHoraire = this.getHoraire.bind(this)
        this.refresh = this.refresh.bind(this)
        this.getUniqueKey = this.getUniqueKey.bind(this)
        this.manageSchedules = this.manageSchedules.bind(this)
        this.displayStation = props.station
        this.station = props.station.replace(" ", "+")
        this.walkTime = parseInt(props.walkTime, 10) ? props.walkTime : 13
        this.way = props.way
        this.line = props.line
        this.destination = props.destination
        this.transportType = props.transportType
        this.imgPath = "../images/"
        this.image = this.imgPath + this.transportType + "/" + this.line+".png"
        this.logo = require("../images/"+this.transportType+"/"+this.line+".png");
    }
    componentDidMount(){
        this.refresh()
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
                            backgroundColor: 'red',
                            paddingLeft: "50px"
                        }
                    })
                }
            })
            .catch(function (error) {
                console.log(error)
                this.setState({
                    title: "Erreur",
                    message: "Les données n'ont pas pu être chargées",
                    slug: "network_error"
                })
            })
    }
    getHoraire() {
        fetch(API + DATA_TYPES[0] + "/" + this.transportType + "/" + this.line + "/" + this.station + "/" + this.way)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    schedules: data.result.schedules.map((schedule) =>{
                        // Get time in minutes
                        schedule.key = this.getUniqueKey()
                        this.diff_minutes(schedule)
                        return schedule
                    })
                })
                this.timerId = setInterval(
                    () => {
                        this.manageSchedules()
                    }, 50000)
            })
            .catch(function (error) {
                // Mock data
                let key = this.getUniqueKey()
                let schedules = [{key: key,
                    destination: "Mock Destination",
                    message: "5",
                    time: 5}]
                this.setState({
                    schedules: schedules

                })
                console.log(error)
            })


    }
    getUniqueKey(){
        this.key = this.key || 0
        return this.key++
    }
    refresh(){
        this.getTraffic()
        this.getHoraire()
    }
    manageSchedules(){
        this.setState(prevState => ({
            schedules: prevState.schedules
                // Supprime l'heure si elle est égale à 0
                .filter(schedule => schedule.time > 0)
                .map((schedule) =>{
                    this.diff_minutes(schedule)
                    return schedule
            })
        }))
    }

    componentDidUpdate(props){
    }
    static editShedule(schedule){
        // Get moment date
        let date = new Date();
        let minutes = date.getMinutes();
        //let hour = date.getHours();
        // Split time in two differents times
        let time = schedule.message.time
        if(parseInt(time, 10) > 0){
             schedule.time = time - minutes
        }
        return schedule

    }
    diff_minutes(schedule)
    {
        let timeHM = schedule.message.split(":")
        let time = 0
        let date = new Date();
        let minutes = date.getMinutes();
        let hour = date.getHours();
        while(parseInt(timeHM[0], 10) > parseInt(hour, 10)){
            timeHM[1] = parseInt(timeHM[1], 10) + 60;
            hour++;
        }
        if(parseInt(timeHM[1],10)> parseInt(minutes, 10)){
            time = timeHM[1] - minutes
            // Set diff time in schedule object
            schedule.time = time
        }
        else{
            schedule.time = 0
        }
        return schedule
    }
    /*
    removeSchedule(schdeduleKey){
        this.setState(prevState => ({
            schedules: prevState.schedules.filter(schedule => schedule.key !== schdeduleKey)
        }))
    }
    */
  render() {
      let walkTime = this.walkTime
      const eachSchedule = function(schedule){
          return (
              <Schedule key={schedule.key}
                  destination={schedule.destination}
                        message={schedule.message}
                        time={schedule.time}>
              </Schedule>
          )
      }
      const Schedule = function(props){
          let displaytime = ""
          let style = {
              color:"black"
          }
          if(props.time === 0){
              displaytime = "Train à l'approche"
          }else if(props.time !== undefined){
              displaytime = "("+props.time + " mn)"
              if(walkTime < props.time){
                  style = {
                      color: "green",
                      fontWeight: "bold"
                  }
              }else{
                  style = {
                      color:"orange"
                  }
              }
          }
          return (
              <div className="row">
                  <div className="col-md-6 col-6">{props.destination}</div>
                  <div className="col-md-6 col-6">{props.message} <span style={style}> {displaytime}</span>  </div>
              </div>
          )
      }
    return (
      <div className="App RATP">
          <div style={this.state.divStyle} className="row"><b><img src={this.logo} alt={this.line} style={{width:"25px",display: "inline"}}/>
              {this.displayStation} </b> <button className="fa fa-refresh" onClick={this.refresh}> </button></div>
          <span className="col-offset-1 col-10"> {this.state.slug !== "normal" ? this.state.message : ""}</span>
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
