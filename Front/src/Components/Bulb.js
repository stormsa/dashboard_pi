/**
 * Created by saziri on 13/03/2018.
 */
import React, {Component} from 'react'
import './App.css'

const API ='http://127.0.0.1:5000/';

class Bulb extends Component{
    constructor(props){
        super(props)
        this.bulbOn = require("../images/bulb/bulb_on.png");
        this.bulbOff = require("../images/bulb/bulb_off.png");
        this.state = {
            bulb : this.bulbOff,
            bright: 50
        }
        this.getState = this.getState.bind(this)
        this.toggle = this.toggle.bind(this)
        this.setBright = this.setBright.bind(this)
        this.bright_up = this.bright_up.bind(this)
        this.bright_down = this.bright_down.bind(this)
        this.style = props.style
    }
    componentDidMount(){
        this.getState()
    }
    getState(){
        let query = 'getState'
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    bulb : data.power === "off" ? this.bulbOff : this.bulbOn,
                    light: data.power,
                    bright: parseInt(data.bright, 10)
                })
            })
    }
    toggle(){
        let query = 'toggle'
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    bulb : data.power === "off" ? this.bulbOff : this.bulbOn,
                    light: data.power
                })
            })
    }
    bright_up(){
        let query = 'bright_up'
        this.setBright(query)
    }
    bright_down(){
        let query = 'bright_down'
        this.setBright(query)

    }
    setBright(query){
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    bright: parseInt(data.bright, 10)
                })
            })
    }

    render(){
        return(
            <div className="App" style={Object.assign({backgroundColor: "#c435e8"}, this.style)}>
                <div style={{backgroundColor: 'yellow'}} className="header col-offset-1 col-12"><b style={{color: 'black'}}>Ampoule </b></div>
                <div className="row">
                    <div className="col-3" >
                        <button className="btn" onClick={this.bright_down} hidden={this.state.light !== "on" || this.state.bright < 10}>
                            <i className="fa fa-minus-square-o fa-5x" aria-hidden="true"/>
                        </button>
                    </div>

                    <div id="zone_ampoule"  className="col-6" >
                        <button className="btn" onClick={this.toggle}>
                            <img id="image" style={{width: "100px"}} alt="bulb" src={this.state.bulb}/>
                        </button>
                    </div>

                    <div className="col-3">
                        <button className="btn" onClick={this.bright_up} hidden={this.state.light !== "on" || this.state.bright > 90}>
                            <i className="fa fa-plus-square-o fa-5x" aria-hidden="true"/>
                        </button>
                    </div>

                </div>

            </div>
        )
    }
}
export default Bulb
