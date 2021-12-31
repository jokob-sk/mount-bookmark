import Background from './components/Background';
import React,{Component} from 'react';
import Main from './components/Main';
import Helper from './Utils';
import {
  BrowserRouter as Router,
  Switch,
  Route  
} from "react-router-dom";


export default class App extends Component{
  constructor(){
    super({});
    // initialise background cookie
    Helper.initBackground(); 
  }
  
  render () {
    return <Router>
    <Switch>
          <Route exact path="/">
            <Background  />
            <Main sources={Helper.getSources()}  />
          </Route>
    </Switch>
    </Router>
  }
}
