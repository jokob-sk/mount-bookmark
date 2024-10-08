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
    "& .MuiGrid-item": {
      width: "inherit",
    },    
    ".MuiListItem-root" : {
      justifycontent: "center !important",
      backgroundColor: colorPalette.backgroundBox,
    },
    backgroundColor: colorPalette.background,
    color: colorPalette.text.primary,
  },
  main: {       
    backgroundColor: colorPalette.backgroundBox,    
    minHeight: "10%",
    padding: "45px",
    opacity:0.6,
    ['@media (min-width:'+minWidth+')']: 
      {       
        position: "absolute",         
        opacity: 0,
        width:"80%",
        marginLeft:"7%",
        top:"17%"
      },
    transitionDelay: "1s",
    transition: "opacity 1s",
    '&:hover': {
      ['@media (min-width:'+minWidth+')']: {opacity:0.8, transition: "opacity 0.2s"},    
    },    
    '& .category':
    {
      backgroundColor:colorPalette.accent2,
      borderRadius: "5px",
      paddingBlockEnd: "25px",
      paddingBlockStart: "15px",
      cursor: "inherit",
    },    
  },
  bookmarkRow:
  {
    padding:"3px",
    // backgroundColor:"red",
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
      width: "90%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
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
    cursor: 'default'
  },
  gridItem:{
    textAlign: 'center',    
    border: "2px solid transparent",
    transition:"0.5s",
    padding: "2px",
    '&:hover':
    {    
      boxShadow: "0 5px 35px 0px "+ colorPalette.accent1,
      borderRadius: "5px",
    },
  },
  icon: {
    color: colorPalette.icon,    
  },
  bookmarkIcon: {
    margin: "5px",
    padding: "2px"
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
    backgroundColor: colorPalette.backgroundBox,
  }
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
      <div>
      {icon ? (
        <SvgIcon fontSize="large" className={clsx(classes.icon, classes.bookmarkIcon)}>
          <path d={icon} />
        </SvgIcon>
      ) : null}
        <div>
          <Typography className={classes.bookmarkName} align="center">{name ? name : ""}</Typography> 
        </div>
      </div>
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
        spacing={1}
        justifyContent="space-evenly"
        alignItems="flex-start"        
        alignContent="space-between"
      >        

        {categories.map((cat) => ( cat?.toLowerCase() !== "hidden" ?
          <Grid 
              xl={4} md={6} sm={6} xs={12} container direction="row"
              className={classes.bookmarkRow}
              >            
              <Grid 
                className='category'
                xs={2} sm={1}
                direction="column"
                justifyContent="center"
              > 
                <Grid item xs={2} sm={1} md={10} xl={10}>
                  <Typography className={classes.bookmarkCategory} >{cat}</Typography>
                </Grid>
              </Grid>  
              <Grid container  xs={10} sm={11}  >             
                {bookmarks.map((bookmark) => bookmark.category === cat ? 
                <Grid className={classes.gridItem} item xs={4} sm={4} md={2} xl={2}>
                  <Link href={bookmark.url} style={{textDecoration: "none"}}>                    
                      <Bookmark icon={bookmark.iconSVGPath} name={bookmark.name} ></Bookmark>                    
                  </Link>
                </Grid>
                : <></>)}
              </Grid>
            </Grid>

        : <></>) )}
      </Grid>


      <Grid container        
       justifyContent="flex-end"
       alignItems="flex-end"
      >
      <Grid
        item xs={12} sm={12} 
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
