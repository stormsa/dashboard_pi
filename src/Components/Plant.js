/**
 * Created by saziri on 13/03/2018.
 */
import React, {Component} from 'react'
import './App.css'

class Plant extends Component{
    constructor(props){
        super(props)
        this.state = {
            lastArrosage: props.lastArrosage
        }
        this.name = props.name
        this.key = props.key
        this.instruction = props.instruction
        this.description = props.description
        this.arrose = this.arrose.bind(this)
    }
    arrose(){
        fetch('plant/arrose', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plant_id: this.key
            })
        })
            .then(response => response.json)
            .then(data =>{
                this.setState({
                    lastArrosage: data.result.lastArrosage
                })
            })
    }
    render(){
        return(
            <div className="App">
                <div style={{backgroundColor: 'green'}} className="col-12"><b>Plante {this.name} </b></div>
                <div className="col-12">Arrosé le : {this.state.lastArrosage}</div>
                <div className="col-12">
                    <b>Conseils d'arrosage </b>
                        <br/>
                            Nombre arrosage : {this.instruction} <br/>
                            Durée de vie : {this.description} <br/>
                </div>
                <div className="col-12">
                    <button className="btn btn-default btn-large" onClick={arrose} style={{backgroundColor:"#28a745"}}><i className="fa fa-shower"> </i> Arroser </button>
                </div>
            </div>
        )
    }
}
export default Plant
