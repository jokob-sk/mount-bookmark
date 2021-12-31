import settings from './config/settings.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


type Image = {
    src: string;
    srcStatic: string,
    folder: string;
  }
  
  type ImageFolder = {
    name: string;
    files: Image[]
  }


const images = importAll(require.context('./config/local_artwork', true, /\.(png|jpe?g|svg|gif|webp)$/));
const folders = getFolders(images);
let backgroundsList = [] as string[];

const sources = ["images", "video" ].concat(folders.reduce(
    function(accumulator, currentValue) {
      return accumulator.concat(new Array(currentValue.name))
    },
    Array()
  ));

  
  //collect all images and their folders
function importAll(r:any) {
    let processedImages : any[] = [];    
    r.keys().map((item:any) => { processedImages.push({src:item.replace('./', ''), srcStatic:r(item).default, folder:item.replace('./', '').split('/')[0]}); return null;})  
    return processedImages;
  }
  
  // create a tree of folders and files
function getFolders(images:Image[]){
    let processedFolders : ImageFolder[] = [];  
    images.map((item:Image)  => processedFolders.find(({name}) => name === item.folder) === undefined ? processedFolders.push({name:item.folder, files:images.filter((ob) => (ob.folder === item.folder),[])}): false)  
    return processedFolders;
  }
  

function getRandomBackground() {
    let source = cookies.get('source') === undefined && cookies.set('source', "video", { path: '/' }) ? "video" : cookies.get('source') as string;
    switch (source)
    {
      case "images":
        backgroundsList = images.map(item => item.srcStatic);
        if(settings.imageSettings.images.length > 0)
        {
          backgroundsList = backgroundsList.concat(settings.imageSettings.images.map(item => item.url))
        }
        return Helper.getRandomEntry(backgroundsList);
        
      case "video":
        backgroundsList = settings.videoSettings.videoIds.map(item => item.id);
        return Helper.getRandomEntry(backgroundsList);
        
      default: // image folder
        backgroundsList = folders.filter(obj => {
            return obj.name === source
          })[0].files.map(item => item.srcStatic);
        return Helper.getRandomEntry(backgroundsList);        
    }
  }

class Helper { 

    static getRandomEntry = (entries:any[])  => {
        const rndInt = Math.floor(Math.random() * entries.length) + 0

        return entries[rndInt]
    }

    static initBackground = ()  => {
        const background = getRandomBackground()
        cookies.set('background', background, { path: '/' })
    
        return background;
    }

    static getSources(){
        return sources;
    }

    static getBackgroundsList(){
        return backgroundsList;
    }

    static isAutoRotate(){
        return settings.generalSettings.refreshBackgroundSeconds !== 0;
    }

    static getAutoRotateSeconds(){
        return settings.generalSettings.refreshBackgroundSeconds;
    }

  
}
export default Helper;
