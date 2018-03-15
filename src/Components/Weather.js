/**
 * Created by saziri on 13/03/2018.
 */
import React, {Component} from 'react'
import './App.css'

const API ='http://api.openweathermap.org/data/2.5/weather';

class Weather extends Component{
    constructor(props){
        super(props)
        this.state = {
            temperature: "",
            humidite: "",
            vent:"",
            image:"",
            long:"",
            lat:''
        }
        this.city = props.city
    }
    componentDidMount(){
        this.getWeather()
    }
    getWeather(){
        let query = '?q='+this.city+',fr&appid=66c5a4a7889ec64b4baf8f8af653e7e9&units=metric'
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    temperature: data.main.temp,
                    humidite: data.main.humidity,
                    vent:(data.wind.speed / 1000 * 3600).toFixed(2),
                    image:"http://openweathermap.org/img/w/"+data.weather[0].icon+".png",
                    long:data.coord.lon,
                    lat:data.coord.lat
                })
            })
    }
    render(){
        return(
            <div className="App">
                <div style={{backgroundColor: 'blue'}} className="col-offset-1 col-12"><b>Météo {this.city} </b> <button className="fa fa-refresh" onClick={this.getWeather}> </button></div>
                <div id="zone_meteo" className="col-12" >
                    <div className="col-12">
                        Température {this.state.temperature} °C
                    </div>
                    <div className="col-12">
                        Humidite {this.state.humidite} %
                    </div>
                    <div className="col-12">
                        <img id="image" style={{width: "100px"}} src={this.state.image}/>
                    </div>

                    <div className="col-12">
                        Vent {this.state.vent} km/h
                        <input type="hidden" id="long" value={this.state.long}/>
                        <input type="hidden" id="lat" value={this.state.lat}/>
                    </div>
                </div>
            </div>
        )
    }
}
export default Weather
