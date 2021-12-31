import React, { useState } from 'react';
import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Card, Grid, InputAdornment, Link, makeStyles, SvgIcon, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import colorPalette from '../config/colorPalette.json';
import settings from '../config/settings.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const minWidth = '780px';


const useStyles = makeStyles({
  root: {
    "& .MuiPaper-root": {
      maxWidth: "100px",
      width:"100px",
    },
    "& .MuiGrid-item": {
      width: "inherit",
    },
    backgroundColor: colorPalette.backroundBox,
    color: colorPalette.text.primary+"!important",
    alignContent: "center center",
  },
  main: {   
    padding: "4px",
    backgroundColor: colorPalette.backroundBox,    
    minHeight: "10%",
    opacity:0.6,
    ['@media (min-width:'+minWidth+')']: 
      {
        width: "40%",
        position: "absolute", 
        padding: "40px",
        opacity: 0,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      },
    transitionDelay: "1s",
    transition: "opacity 1s",
    '&:hover': {
      ['@media (min-width:'+minWidth+')']: {opacity:0.8, transition: "opacity 0.2s"},    
    },    
  },
  bookmarkName: {
    fontFamily: "UbuntuMono",
    letterSpacing: "1.2",
    fontSize: "0.6em",
    width:'100%',
    display: 'none',    
    ['@media (min-width:'+minWidth+')']: {
      fontSize: "0.98em",
      display: 'block',
    },
    fontWeight: "bold",
    color: colorPalette.text.primary,
    textAlign: 'center',
    alignContent: "center center",
  },
  bookmarkLink: {
    fontFamily: "UbuntuMono",
    letterSpacing: "0.8",
    fontWeight: "normal",
    fontSize: "0.7em",
    color: colorPalette.text.secondary,
  },
  bookmarkCategory: {
    fontFamily: "UbuntuMono",
    letterSpacing: "1.3",
    ['@media (min-width:'+minWidth+')']: {fontSize: "1.3em"},
    fontWeight: "bold",
    color: colorPalette.accent1,
  },
  gridItem:{
    textAlign: 'center',
    width: 'inherit',
  },
  icon: {
    color: colorPalette.icon
  },
  bookmarkIcon: {
    marginRight: "10px"
  },
  dropdownForm: {
    color: colorPalette.text.primary+"!important",
    width: "100%",
    '&::after': {
      borderBottom: '2px solid '+colorPalette.accent1+"!important",    
    },
    '& .MuiInput-underline::before': {
      borderBottomColor: colorPalette.text.primary
    },
    '& input': {
      color: colorPalette.text.primary,
    },
    '& .MuiPaper-root': {
      width: "50px!important"
    },
  },
  formControl: {
    margin: "3px",
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: "3px",
    color: colorPalette.text.primary,
  },
  inputFocused: {
    color: colorPalette.text.primary+"!important",
    backgroundColor: colorPalette.backroundBox,
  },
  searchBar: {
    width: "100%",
    '& .MuiInput-underline::after': {
      borderBottomColor: colorPalette.accent1,
    },
    '& .MuiInput-underline::before': {
      borderBottomColor: colorPalette.text.primary
    },
    '& input': {
      color: colorPalette.text.primary,
    },
  },
  grid: {
    width: "100%",
    height: "100%",
  }
});

interface IBookmark {
  icon?: string,
  name?: string,
  link?: string,
  xs?: any
}

function Bookmark(props: IBookmark) {
  const classes = useStyles();

  const {
    icon,
    name,
    link
  } = props

  return (
    <Grid item xs={3}>
      <Link href={link} style={{textDecoration: "none"}}>
        <Grid
          container       
          alignItems="center"
        >
          <Grid item
          direction="column"
          className={clsx(classes.gridItem)}
          >
            {icon ? (
              <SvgIcon fontSize="large" className={clsx(classes.icon, classes.bookmarkIcon)}>
                <path d={icon} />
              </SvgIcon>
            ) : null}
          </Grid>


          <Grid 
            item 
            xs={12} 
            >
            <Typography className={classes.bookmarkName} align="center">{name ? name : ""}</Typography> 
          </Grid>

        </Grid>
      </Link>
    </Grid>
  )
}

function Info(props:any) {
  const classes = useStyles();

  return (    
      <>
        
        {props.icon ? (
          <SvgIcon onClick={() => { alert(cookies.get('background'))}} fontSize="small" className={clsx(classes.icon, classes.bookmarkIcon)}>
            <path d={props.icon} />
          </SvgIcon>
        ) : null}
      </>
  )
}

function Main(props:any) { 
  let classes = useStyles();
  const sources = props.sources as string[];
  const [searchQuery, setSearchQuery] = useState<string>("");    
  
  const handleChange = (event: any) => {
    setSearchQuery(event.target.value)
  }

  const handleBackgroundChange = (event: any) => {    
    cookies.set('source', event.target.value, { path: '/' });    
  }

  const handleKeyPress = (event: any) => {
      if(event.key === 'Enter'){

        // search (not a full URL with http/https)
        if(!searchQuery.startsWith('http://') && !searchQuery.startsWith('https://'))
        {
          // use default search engine if not overriden
          var searchEngine = settings.searchSettings.defaultSearchEngine;
          var searchQueryNew = searchQuery;
          console.log(settings.searchSettings)
          // overriding the default search engine        
          if(searchQuery.length > 3 && searchQuery[1] === ' ')
          {
            settings.searchSettings.searchEngines.map(function(engine){              
                if(engine.key === searchQuery[0].toLowerCase() )
                {
                  searchEngine = engine.url;
                  searchQueryNew = searchQuery.slice(2);
                }                
                return null;
              }              
            )         
          }
          // execute search
          document.location.href = searchEngine + searchQueryNew;
        
        }
      // searchquery is full URL so just redirect (a full URL with http/https))
      else{
        document.location.href = searchQuery;
      }
    }
 }


  return (
    <Card elevation={3} className={classes.main}  style={searchQuery.length !== 0 ? {opacity: "0.8"} : {}}>
      <Grid 
        container 
        spacing={2}
        justify="space-evenly"
        alignItems="flex-start"
        className="grid"
        alignContent="space-between"
      >
        <Grid item xs={10}>
          <TextField
            className={classes.searchBar}
            placeholder="Search"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoFocus={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2} >
        <FormControl 
         className={classes.dropdownForm}
        >
        <Select
          id="select-background"
          onChange={handleBackgroundChange}
          className={classes.dropdownForm}
          inputProps={{ style: {  color: colorPalette.text.primary}}}    
          MenuProps={{ classes: { paper: classes.root }}}    
          defaultValue={cookies.get('source')}      
        >
          {sources.map(item => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
        </Select>
      </FormControl>

        </Grid>
        {settings.bookmarkCategories.map(category => (
          <Grid item xs={12}>
            <Typography className={classes.bookmarkCategory}>{category.name}</Typography>
            <Grid 
              container 
              spacing={1}
              justify="flex-start"
              alignItems="flex-start"
              className="grid"
              alignContent="space-between"
            >
              {category.bookmarks.map(bookmark => (
                <Bookmark icon={bookmark.svgPath} name={bookmark.name} link={bookmark.link} ></Bookmark>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid container
       spacing={5}
       justify="flex-end"
       alignItems="flex-end"
      >
      <Grid
        item xs={12}
        className="grid-info"
        >
        <Info icon={settings.generalSettings.infoIcon} ></Info>  
      </Grid>
      </Grid>
    </Card>
  );
}
 
export default Main;
