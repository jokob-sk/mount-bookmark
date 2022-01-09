import clsx from 'clsx';
import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import { makeStyles, useMediaQuery } from '@material-ui/core';
import settings from '../config/settings.json';
import Helper from '../Utils';
import { useState } from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const useStyles = makeStyles({
  imageBackground: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center center',
    backgroundRepeat:'no-repeat',
    backgroundSize: 'cover',  
    zIndex:-1,
    top:0,
    left:0,
    position: "fixed",
  },
  videoBackground: {
    background: "#000",
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: -1,
    marginTop: settings.videoSettings.offSet.top,
    marginRight: settings.videoSettings.offSet.right,
    marginBottom: settings.videoSettings.offSet.bottom,
    marginLeft: settings.videoSettings.offSet.left,
    '&::after': {
        display: "block",
        content: '',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    '& iframe': {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }
  },
  videoForeground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
  },
  minAspect: {
    height: "300%",
    top: "-100%"
  },
  maxAspect: {
    width: "300%",
    left: "-100%"
  }
});

function Background() {
  const classes = useStyles();
  const [background, setBackground] = useState<string>(cookies.get('background') !== undefined ? cookies.get('background') : settings.imageSettings.images[0].url);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const autoRotate = Helper.isAutoRotate();
  const isImage = background !== undefined ? background.indexOf("/") > -1 : undefined;  
  const mediaQueryMinAspect = useMediaQuery('(min-aspect-ratio: 16/9)');

  function _onEnd(event: { target: YouTubePlayer; data: number }) {
      event.target.playVideo();
  }

  const videoOptions: Options = {
    playerVars: {
      autoplay: settings.videoSettings.autoplay ? 1 : 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: settings.videoSettings.mute ? 1 : 0,
      disablekb: 1,
      fs: 0
    }
  };

  // start rotating backgrounds
  function autoBackgroundChange()
  { 
    setBackground(Helper.initBackground())
    setTimeout(autoBackgroundChange, settings.generalSettings.refreshBackgroundSeconds * 1000)
  }

  if(isLoading && autoRotate)
  {
    setIsLoading(false)
    autoBackgroundChange()      
  }

  if(isImage === undefined)
  {
    return <>Loading...</>;
  }
  else{  
    return (
      <>
        <div className={isImage ? "" : classes.videoBackground}>
          <div className={isImage ? "" : clsx(classes.videoForeground, mediaQueryMinAspect ? classes.minAspect : classes.maxAspect)}>
              {isImage ? 
                
                  <div className={classes.imageBackground} style={{backgroundImage: `url(${background})`}}/>
                
                : 
                <YouTube
                  videoId= {background}
                  opts={videoOptions}
                  onEnd={_onEnd}
              />}
          </div>
        </div>
      </>
    );
  }
}

export default Background;