console.log("working js");

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
        let a=song.split("-");
        let b=a[0].lastIndexOf("/");
        let c=a[0].substr(b+1);
        let artist=c.replaceAll("%20"," ").replace("%2C",", ");
        // console.log(i,artist);
        let d=a[1].indexOf("(");
        let title;
        if(d!==-1){
            let e=a[1].substr(3,d-6);
            title=e.replaceAll("%20"," ");
        }else{
            let f=a[1].replaceAll("%20"," ");
            title=f.substr(0,f.length-4).replace("%5B"," ").replace("%5D"," ");
        }
        title=title.trim(" ");
        console.log(i,title);
        card+=`<div class="card">
        <img src="utilities/${title}.jpg" alt="">
        <h3 id="song">${title}</h3>
        <h3 id="artists">${artist}</h3>
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
    let curSong;
    libItem.forEach((item)=>{
        item.addEventListener("click",()=>{
            if(curSong!==undefined){
                curSong.pause();
            }
            ppBtn.innerHTML="pause_circle";
            let comm=item.childNodes[1];
            console.log(comm.textContent);
            curSong=new Audio(comm.textContent);
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

