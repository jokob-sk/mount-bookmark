import React, { useState } from 'react';
import { InputAdornment, TextField, makeStyles, withStyles, SvgIcon, Chip,  Paper, Box, Typography, Card} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

function CustomSearch(attrb) {

  // Part of React magic START
  var inputRef = null;
  // Part of React magic END
  const [searchQuery, setSearchQuery] = useState("");
  const [searchEngine, setSearchEngine] = useState(attrb.defaultSearchEngine);
  const [searchEngineOverriden, setSearchEngineOverriden] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [bookmarkSelected, setBookmarkSelected] = useState(false);

  // Look and Feel
  const useStylesLabel = makeStyles({
    label: {
      opacity: 1,
      "&  .MuiChip-deleteIcon":
      {
        color: attrb.searchInputStyles.color
      }
    }
  })

  const useStylesSearchBox = makeStyles({
      root:{
        "& .MuiPaper-root":{
          backgroundColor: attrb.searchBoxStyles.background + "!important",
        },
        backgroundColor: attrb.searchBoxStyles.background + "!important",
        "& .MuiPaper-elevation1":{
          boxShadow: "0px 0px 0px 0px !important"
        }
      },
      search: {
          opacity: attrb.animationStart,
          ['@media (min-width:' + attrb.minWidth + ')']:
          {
              transitionDelay: attrb.hideDelay + "s",
              opacity: attrb.animationStart,
              animation: "$loadAnimation " + attrb.hideDuration + "s ease-in " + attrb.hideDelay + "s",
              animationFillMode: "forwards"
          },
          '&:hover': {
              ['@media (min-width:' + attrb.minWidth + ')']: {
                  animation: "$hoverAnimation " + attrb.hideDuration + "s ease-in " + attrb.hideDelay + "s",
                  animationFillMode: "forwards"
              },
          },
          '& .MuiInputBase-root':
          {
            color: attrb.searchInputStyles.color,
          }          
      },
      "@keyframes loadAnimation": {
          "to": showSearchBox ? {
              transitionDelay: attrb.hideDelay + "s",
              transition: "opacity " + attrb.hideDuration + "s",
              opacity: attrb.animationStart
          } :
              {
                  opacity: attrb.animationEnd
              }
      },
      "@keyframes hoverAnimation": {
          "to": {
              opacity: attrb.animationStart
          }
      },
      "@keyframes typingAnimation": {
          "to": {
              opacity: attrb.animationStart
          }
      }
  });

  const CustomColorsTextField = withStyles({
    root: {
      '& .MuiInputBase-input': {
        color: attrb.searchInputStyles.color, // Text color
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: attrb.searchInputStyles.underlineColor, // Semi-transparent underline
      },
      '& .MuiInput-underline:hover:before': {
        borderBottomColor: attrb.searchInputStyles.color, // Solid underline on hover
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: attrb.searchInputStyles.color, // Solid underline on focus
      },
    },
  })(TextField);

  // Bookmark suggestion dropdown
  const PaperMy = function ({ children }) {
    console.log(children)
    return <Paper style={attrb.paperStyles} className={classesPopper.autocomplete}>{children}</Paper>;
  };

  const useStylesPopper = makeStyles({
    autocomplete: {       
      '& .MuiAutocomplete-option':
        {       
          textAlign: 'center',
          display: 'block',
          width: '95%',
          marginLeft: '2.5%',
          borderRadius: '3px',          
          alignContent: 'center',
          '&[data-focus="true"]': {
            backgroundColor: attrb.paperStyles.hoverColor,           
          },
          '& .MuiInput-input':{
            color: 'red',
            border: 'none'
          },
          '& svg':{
            float:'left'
          }
        }      
    },
  });

  // generate CSS
  const classesLabel = useStylesLabel();
  const classesSearchBox = useStylesSearchBox();
  const classesPopper = useStylesPopper();

  // Event handling

  // capture search input and handle search engine override
  function handleChange(event) {

    const textInput = event.target.value;

    console.log(event.target.value)

    setShowSearchBox(searchEngineOverriden || textInput.length > 0)

    // detecting and removing custom search engine override
    detectOverride(event);

    setSearchQuery(textInput)
  }

  // detecting and removing custom search engine override
  function detectOverride(event)
  {
    const textInput = event.target.value;

    if (textInput.length > 1 && textInput[1] === ' ') {
      attrb.searchEngines.map(function (engine) {
        if (engine.key === textInput[0].toLowerCase()) {
          // React magic START - Based on: https://codesandbox.io/embed/material-demo2-1hvzq?fontsize=14&hidenavigation=1&theme=dark
          var input = inputRef.querySelector("input");
          var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;
          // replace input value (remove 2 start characters)
          nativeInputValueSetter.call(input, textInput.slice(2));
          var inputEvent = new Event("input", { bubbles: true });
          input.dispatchEvent(inputEvent);
          // React magic END
          setSearchEngine(engine);
          setSearchEngineOverriden(true);
        }
        return null;
      })
    }
  }

  function handleOnKeyDown(event) {
    if (event.key === "Backspace" && searchEngineOverriden && event.target.value === "") {
        handleLabelDelete();
    }
  }

  function handleLabelDelete() {
    setSearchEngineOverriden(false);
    setSearchEngine(attrb.defaultSearchEngine);
    setShowSearchBox(searchQuery.length > 1)
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      // execute search
      if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) // searchquery is full URL so just redirect (a full URL with http/https))
      {
          document.location.href = searchQuery;
      } else if (searchEngine) // search engine
      {
          document.location.href = searchEngine.url + searchQuery;
      }
    }
  }

  // a bookmark selected
  function handleAutocompleteChange(event, value) {
    setBookmarkSelected(true)
    document.location.href = value.url;
  }  

  return (
      <React.Fragment >
        <div style={ attrb.searchBoxContainerStyles} >
          <Card style={ attrb.searchBoxStyles} className={classesSearchBox.search}  >
            <Autocomplete
              disableClearable
              autoHighlight
              //disableCloseOnSelect
              id="combo-box-demo"
              freeSolo = {true}
              PaperComponent={PaperMy} // dropdown popup for the bookmarks
              open={!bookmarkSelected && searchQuery.length > 2 && !searchEngineOverriden  } // open the bookmarks dropdown popup only when...
              options={attrb.bookmarks}
                                
              placement="bottom"
              getOptionLabel={(bookmark) => bookmark.name}
              renderOption={(  option) => { 
                return (
                  <Box  >
                      {attrb.bookmarksShowIconInPopup && option.iconSVGPath ?
                            <SvgIcon>
                                  <path d={option.iconSVGPath} />
                            </SvgIcon>
                            : <></>
                      }
                        <Typography  >{option.name}</Typography>
                    </Box> 
                )
            }}
              
              onChange={handleAutocompleteChange}
              // Part of React magic START
              ref={input => {
                inputRef = input;
              }}
              // Part of React magic END
              renderInput={(params) =>
                <CustomColorsTextField
                  {...params}                                                
                  placeholder="Search"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}                
                  onKeyDown={handleOnKeyDown}
                  autoFocus={true}
                  style={attrb.searchIconStyles}
                  variant="standard"
                  sx={{
                    '& .MuiInput-underline:before': { borderBottomColor: 'orange' },
                    '& .MuiInput-underline:after': { borderBottomColor: 'orange' },
                  }}
                  InputProps={{                  
                      ...params.InputProps,                                        
                      startAdornment: (
                          <InputAdornment position="start" >
                              <SvgIcon style={attrb.searchIconStyles}>
                                  <path d={attrb.keepDefaultIcon  ? attrb.defaultSearchEngine.iconSVGPath : searchEngine.iconSVGPath} />
                              </SvgIcon>
                              {
                                  searchEngine.name ?
                                      <Chip
                                          label={searchEngine.name}
                                          size="small"
                                          onDelete={handleLabelDelete}
                                          className={classesLabel.label}
                                          style = {attrb.labelStyles}
                                      />
                                      :
                                      ""
                              }
                          </InputAdornment>
                      ),
                  }}
                />}
            />
          </Card>
        </div>
      </React.Fragment>
  )
}
export default CustomSearch;

// Default settings
CustomSearch.defaultattrb = {
    hideDelay: "3",
    hideDuration: "2",
    minWidth: "780px",
    animationStart: "0.8",
    animationEnd: "0.3",
    keepDefaultIcon: true,
    defaultSearchEngine: {
        "key": "",
        "name": "",
        "url": "https://www.duckduckgo.com/?q=",
        "iconSVGPath": "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
    },
    searchEngines: [
        {
            "key": "e",
            "name": "Ecosia",
            "url": "https://www.ecosia.org/search?q=",
            "iconSVGPath": "M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2"
        },
        {
            "key": "g",
            "name": "Google",
            "url": "https://www.google.com/search?q=",
            "iconSVGPath": "M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1"
        },
        {
            "key": "d",
            "name": "Duckduckgo",
            "url": "https://www.duckduckgo.com/?q=",
            "iconSVGPath": "M8.5,5A1.5,1.5 0 0,0 7,6.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 10,6.5A1.5,1.5 0 0,0 8.5,5M10,2A5,5 0 0,1 15,7C15,8.7 14.15,10.2 12.86,11.1C14.44,11.25 16.22,11.61 18,12.5C21,14 22,12 22,12C22,12 21,21 15,21H9C9,21 4,21 4,16C4,13 7,12 6,10C2,10 2,6.5 2,6.5C3,7 4.24,7 5,6.65C5.19,4.05 7.36,2 10,2Z"
        },
        {
            "key": "b",
            "name": "Bing",
            "url": "https://www.bing.com/search?q=",
            "iconSVGPath": "M5,3V19L8.72,21L18,15.82V11.73H18L9.77,8.95L11.38,12.84L13.94,14L8.7,16.92V4.27L5,3"
        },
        {
            "key": "m",
            "name": "Maps",
            "url": "https://www.google.com/maps/search/",
            "iconSVGPath": "M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z"
        },
        {
            "key": "y",
            "name": "YouTube",
            "url": "https://www.youtube.com/results?search_query=",
            "iconSVGPath": "M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
        }
    ],
    bookmarks:[
      {
        "name":"YouTube",
        "url":"https://www.youtube.com/",
        "iconSVGPath":"M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"
      }
    ],
    bookmarksShowIconInPopup: true,
    labelStyles:
    {
      color:"black",
      backgroundColor: "grey",
    },
    searchBoxStyles:
    {
      padding: "20px",
      backgroundColor: "#e1d6d6",
      width: "90px"
    },
    paperStyles: {
      width: "fit-content"

   }
}