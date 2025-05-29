async function getSongs() {
    const response = await fetch("http://127.0.0.1:5500/songs/");
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    let aSongs=doc.querySelectorAll("li a");
    let songArr=[];
    aSongs.forEach((song)=>{
        if(song.href.endsWith("mp3")){
            songArr.push(song.href);
        }
    })
    return songArr;
}

async function main(){
    let songs= await getSongs();
    let trendingSongs=document.querySelector(".trendingSongs");
    let library=document.querySelector(".library");
    let card=``;
    let sCard=``;  
    songs.forEach((song,i)=>{
        let arr=song.split("-");
        let last=arr[0].lastIndexOf("/");
        let artist=arr[0].substr(last+1).replaceAll("%20"," ").replace("%2C",", ");
        // console.log(i,artist);
        let idx=arr[1].indexOf("(");
        let title;
        if(idx!==-1){
            title=arr[1].substr(3,idx-6).replaceAll("%20"," ");
        }else{
            let s=arr[1].replaceAll("%20"," ");
            title=s.substr(0,s.length-4).replace("%5B"," ").replace("%5D"," ");
        }
        title=title.trim(" ");
        // console.log(i,title);
        card+=`<div class="card">
            <h5>${song}</h5>
            <img src="utilities/${title}.jpg" alt="">
            <h3 id="song">${title}</h3>
            <h4 id="artists">${artist}</h4>
        </div>`
        sCard+=`<div class="sCard flex-ai-center">
                <h5>${song}</h5>
                <span class="material-symbols-outlined">library_music</span>
                <div class="dets">
                    <h3>${title}</h3>
                    <h4>${artist}</h4>
                </div>
                <span class="material-symbols-outlined" id="like">favorite</span>
                <span class="material-symbols-outlined" id="more">more_vert</span>
            </div>`
    })
    trendingSongs.innerHTML=card;
    library.innerHTML=sCard;
    // console.log(songs);
    let libItem=document.querySelectorAll(".sCard");
    libItem.forEach((item)=>{
        item.addEventListener("mouseenter",()=>{
            item.children[3].style.opacity=1;
            item.children[4].style.opacity=1;
        })
    })
    libItem.forEach((item)=>{
        item.addEventListener("mouseleave",()=>{
            item.children[3].style.opacity=0;
            item.children[4].style.opacity=0;
        })
    })
    let ppBtn=document.querySelector("#ppBtn");
    let playerDets=document.querySelector(".currentlyPlaying .dets")
    let curSong;
    libItem.forEach((item)=>{
        item.addEventListener("click",()=>{
            if(curSong!==undefined){
                curSong.pause();
            }
            ppBtn.innerHTML="pause_circle";
            playerDets.innerHTML=item.children[2].innerHTML;
            let address=item.childNodes[1];
            // console.log(address.textContent);
            curSong=new Audio(address.textContent);
            curSong.play();
        })
    })
    let cardItem=document.querySelectorAll(".card");
    cardItem.forEach((item)=>{
        item.addEventListener("click",()=>{
            if(curSong!==undefined){
                curSong.pause();
            }
            ppBtn.innerHTML="pause_circle";
            playerDets.children[0].textContent=item.children[2].textContent;
            playerDets.children[1].textContent=item.children[3].textContent;
            let address=item.childNodes[1];
            // console.log(address.textContent);
            curSong=new Audio(address.textContent);
            curSong.play();
        })
    })
    ppBtn.addEventListener("click",()=>{
        let status=ppBtn.textContent;
        if(status.startsWith("play")){
            curSong.play();
            ppBtn.innerHTML="pause_circle";
        }else{
            curSong.pause();
            ppBtn.innerHTML="play_circle";
        }
    })
    document.addEventListener("keydown",(evnt)=>{
        if(evnt.key==" "){
            let status=ppBtn.textContent;
            if(status.startsWith("play")){
                curSong.play();
                ppBtn.innerHTML="pause_circle";
            }else{
                curSong.pause();
                ppBtn.innerHTML="play_circle";
            }
        }
    })
}
main()
