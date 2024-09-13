let currentSong=new Audio()
play=document.querySelector(".playbar .play")
let songs=[]
let songmap={}
async function getsongs(){
let a= await fetch("http://127.0.0.1:3000/songs/")

let response=await a.text()

let div=document.createElement("div")
div.innerHTML=response



let as=div.getElementsByTagName("a")




for (let i = 0; i < as.length; i++) {

if (as[i].href.endsWith("mp3")) {
    // Extract the filename

    let originalfile = as[i].href.split("/songs/")[1];
    let filename = originalfile.replace(".mp3", "");
    
    // Replace underscores with spaces
    filename = filename.replace(/_/g, " ");
    
    // Remove anything in parentheses
    filename = filename.replace(/\(.*\)/g, "");
    filename = filename.replace(/%20-%20Copy/g, "");
    filename = filename.replace(/%20/g, "");
    
    filename = filename.replace(/Official Video/gi, "")
                       .replace(/Official Audio/gi, "")
                       .replace(/Home Session/gi, "")
                       .replace(/Music Video/gi, "")
                       .replace(/Latest/gi, "")
                       .replace(/New Song/gi, "")
                       .replace(/New EP/gi, "");
    
    // Split the string into parts
   
    
    let parts = filename.split(" - ");
   
  
    // Take the first two parts: singer and song name
    if (parts.length >= 2) {
        let singer = parts[0].trim();
        let songName = parts[1].split(" ft")[0].trim(); 
        let cleanedname=`${songName} - ${singer}`
     
        
        songmap[cleanedname]=originalfile
        songs.push(cleanedname);
    }
}
}

return songs;
}
const playsong = (track,pause=false)=>{
  currentSong.src="/songs/"+songmap[track]
  if(!pause){
  currentSong.play()
  play.src="/iimages/pause.svg"
  }
  
  document.querySelector(".songinfo").innerHTML=`${track}`
   document.querySelector(".songtime").innerHTML="00:00/00:00"
};

function convertTime(seconds) {
    // Handle invalid input by returning '00:00'
    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }

    // Round down to the nearest whole second
    const roundedSeconds = Math.floor(seconds);

    // Convert seconds to minutes
    const minutes = Math.floor(roundedSeconds / 60);

    // Get remaining seconds
    const remainingSeconds = roundedSeconds % 60;

    // Pad with leading zeros if necessary and return the formatted string
    return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');
}
// console.log(songmap);

  
async function main(){
    let songs=await getsongs()
    document.querySelector(".songinfo").innerHTML=`${songs[0]}`
  
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    //     console.log(duration);
        
    //   });

      let ul=document.querySelector(".songs ul")
      
     for (const song of songs) {
        ul.innerHTML=ul.innerHTML+ `<li> <img src="iimages/music.svg" alt="">
                        <div class="song">
                            <div class="songname">
                                ${song} 
                            </div>
                                <div class="singrname">
                                    Tarun
                                </div>
                        </div>
                        <div class="playnow">
                            <span class="play">
                                Playnow
                            </span>
                            <img src="iimages/play.svg" alt="">
                        </div></li>`
     }
    playsong(songs[0],true)
    lis=ul.getElementsByTagName("li")
    Array.from(lis).forEach(e=>{
        e.addEventListener("click",()=>{
           playsong(e.querySelector(".songname").innerHTML.trim())
        })
    })
    
    play.addEventListener("click",() => {
        if(currentSong.paused){
            currentSong.play()
            play.src="/iimages/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="/iimages/play.svg"
        }
      
    }
    )
    currentSong.addEventListener("timeupdate",() => {
        console.log(currentSong.duration);
        
        document.querySelector(".songtime").innerHTML=`${convertTime(currentSong.currentTime)}/${convertTime(currentSong.duration)}`
       document.querySelector(".circle").style.left=currentSong.currentTime/currentSong.duration*100+"%"
        document.querySelector(".progress").style.width=currentSong.currentTime/currentSong.duration*100+"%"
        
    }
    )
    document.querySelector(".seekbar").addEventListener("click",e=>{
        clickpositionpercent=e.offsetX/e.target.getBoundingClientRect().width*100;
        document.querySelector(".circle").style.left=clickpositionpercent
        currentSong.currentTime=(clickpositionpercent/100)*currentSong.duration
       
       })

    document.querySelector(".ham").addEventListener("click",() => {
        document.querySelector(".left").style.left="0"
    }
    )   

    document.querySelector(".close").addEventListener("click",(e) => {
        document.querySelector(".left").style.left="-100vw"
      
    }
    )
     
    let previous=document.querySelector(".previous")
    let  next=document.querySelector(".next")
   
            previous.addEventListener("click",() => {
                let songsrc=currentSong.src.split("/songs/")[1]
                let songkey= Object.keys(songmap).find(function(key){
                    return songmap[key]==songsrc
                        })
                let index=songs.indexOf(songkey)
               
                if(index==0){
                    playsong(songs[index])
                  }
                      else{
                         playsong(songs[index-1])
                      }

        })  
        next.addEventListener("click",() => {
            let songsrc=currentSong.src.split("/songs/")[1]
            let songkey= Object.keys(songmap).find(function(key){
                       return songmap[key]==songsrc
                    })
            let index=songs.lastIndexOf(songkey)
            if(index==songs.length-1){
                playsong(songs[0])
              }
                  else{
                     playsong(songs[index+1])
              }
        }
        )
    }
    
   

main()

