import Background from './components/Background';
import React,{Component} from 'react';
import CustomSearch from './components/customSearch';
import settings from './config/settings.json';
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
            <CustomSearch
             labelStyles = {settings.labelStyles}             
             searchBoxContainerStyles = {settings.searchBoxContainerStyles}      
             searchBoxStyles = {settings.searchBoxStyles}      
             paperStyles = {settings.paperStyles}     
             searchInputStyles = {settings.searchInputStyles}
             searchIconStyles = {settings.searchIconStyles}
             defaultSearchEngine = {settings.searchSettings.defaultSearchEngine}
             keepDefaultIcon = {settings.searchSettings.keepDefaultIcon}
             animationEnd = {settings.searchSettings.styles.opacityAtAnimationEnd}
             animationStart = {settings.searchSettings.styles.opacityAtAnimationStart}
             minWidth = {settings.searchSettings.styles.minScreenWidthToEnableHide}
             hideDuration = {settings.searchSettings.styles.hideAnimationDurationSeconds}
             hideDelay = {settings.searchSettings.styles.hideAnimationDelaySeconds} 
             bookmarks = {settings.bookmarks}     
             searchEngines = {settings.searchSettings.searchEngines}
             bookmarksShowIconInPopup = {settings.bookmarksShowIconInPopup}
            
            ></CustomSearch>
          </Route>
    </Switch>
    </Router>
  }
}
