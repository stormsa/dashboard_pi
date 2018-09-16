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
            bulb : this.bulbOff
        }
        this.getState = this.getState.bind(this)
        this.toggle = this.toggle.bind(this)
    }
    componentDidMount(){
        this.getState()
    }
    getState(){
        let query = 'getState'
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                console.log("hello bulb")
                this.setState({
                    bulb : data.power === "off" ? this.bulbOff : this.bulbOn
                })
            })
    }
    toggle(){
        let query = 'toggle'
        fetch(API + query)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    bulb : data.power === "off" ? this.bulbOff : this.bulbOn
                })
            })
    }
    render(){
        return(
            <div className="App" style={{backgroundColor: "#c435e8"}}>
                <div style={{backgroundColor: 'yellow'}} className="header col-offset-1 col-12"><b style={{color: 'black'}}>Ampoule </b></div>
                <div id="zone_ampoule"  className="col-12" >
                    <button className="btn" onClick={this.toggle}>
                        <img id="image" style={{width: "100px"}} alt="bulb" src={this.state.bulb}/>
                    </button>
                </div>
            </div>
        )
    }
}
export default Bulb
