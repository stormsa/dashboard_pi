/**
 * Created by saziri on 13/03/2018.
 */
import React, {Component} from 'react'
import './App.css'

class Plant extends Component{
    constructor(props){
        super(props)
        this.name = props.name
    }
    render(){
        return(
            <div className="App">
                <div style={{backgroundColor: 'green'}} className="col-12"><b>Plante {this.name} </b></div>
                <div className="col-12">Arrosé le : 10/03/17</div>
                <div className="col-12">
                    <b>Conseils d'arrosage </b>
                        <br/>
                            Nombre arrosage :<br/>
                            Durée de vie :<br/>
                </div>
                <div className="col-12">
                    <button className="btn btn-default btn-large" style={{backgroundColor:"#28a745"}}><i className="fa fa-shower"> </i> Arroser </button>
                </div>
            </div>
        )
    }
}
export default Plant
