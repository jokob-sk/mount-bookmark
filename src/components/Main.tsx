import clsx from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Card, Grid,  Link, makeStyles, SvgIcon,  Typography } from '@material-ui/core';
import colorPalette from '../config/colorPalette.json';
import settings from '../config/settings.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const minWidth = '1500px';


const useStyles = makeStyles({
  root: {
    "& .MuiPaper-root": {
     
    },
    "& .MuiGrid-item": {
      width: "inherit",
    },
    backgroundColor: colorPalette.backroundBox,
    color: colorPalette.text.primary+"!important",
    alignContent: "center center",
  },
  main: {       
    backgroundColor: colorPalette.backroundBox,    
    minHeight: "10%",
    padding: "40px",
    opacity:0.6,
    ['@media (min-width:'+minWidth+')']: 
      {       
        position: "absolute",         
        opacity: 0,
        width:"80%",
        marginLeft:"7%",
        top:"7%"
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
      fontSize: "0.85em",
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
    ['@media (min-width:'+minWidth+')']: {fontSize: "1em"},
    fontWeight: "bold",
    color: colorPalette.accent1,
    // textOrientation:"upright",
    writingMode: "vertical-rl",
    textAlign: 'center',
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
    }
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
  
});

interface IBookmark {
  icon?: string,
  name?: string,
  link?: string,
  sm?: any
}

let categoriesBookmarksTree: [{
  category?: String,
  bookmark?:[
  {
    category?:string,
    name?:string,
    url?:string,
    iconSVGPath?:string
  }]
}] = [{}];

let categories : String[] = [];
let bookmarks =  settings.bookmarks;

function Bookmark(props: IBookmark) {
  const classes = useStyles();

  const {
    icon,
    name,
    link
  } = props

  return (
    <Grid item sm={2} xs={2}>
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
            sm={12} 
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
 
  const handleBackgroundChange = (event: any) => {    
    cookies.set('source', event.target.value, { path: '/' });    
  }

  function prepareBookmarks()
  {    
    // populate categories
    bookmarks.map(item => categories.find(catItem => catItem === item.category ) === undefined ? categories.push(item.category) : false)
  }
  

  prepareBookmarks()

  return (
    <Card elevation={3} className={classes.main} >
      <Grid 
        container 
        spacing={2}
        justify="space-evenly"
        alignItems="flex-start"
        className="grid"
        alignContent="space-between"
      >        

        {categories.map((cat) => ( cat?.toLowerCase() !== "hidden" ?
          <Grid xl={4} md={4} sm={6} xs={12} container          

          >            

              <Grid 
                sm={1}   
                xs={2}             
                container
                direction="column"
                justifyContent="center"
               
                
              > 
                <Grid item sm={12} xs={10}>
                  <Typography className={classes.bookmarkCategory} >{cat}</Typography>
                </Grid>
              </Grid>  
              <Grid container sm={11} xs={10} spacing={3}>             
                {bookmarks.map((bookmark) => bookmark.category === cat ? 
                <Grid item sm={2} xs={3} >  
                  <Bookmark icon={bookmark.iconSVGPath} name={bookmark.name} link={bookmark.url} ></Bookmark>
                </Grid>
                : <></>)}
              </Grid>
            </Grid>

        : <></>) )}
      </Grid>


      <Grid container
       spacing={3}
       justify="flex-end"
       alignItems="flex-end"
      >
      <Grid
        item sm={12} xs={12}
        className="grid-info"
        >
        <Info icon={settings.generalSettings.infoIcon} ></Info>  
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
      </Grid>
    </Card>
  );
}
 
export default Main;
