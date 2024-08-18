// console.log('letss gooo');
let songs;
let currentfolder;

// setInterval(() => {
//     let pb= document.querySelector(".playbar")

//     function getRandomColor(){
//         let val1 = Math.ceil(0 + Math.random()* 255);
//         let val2 = Math.ceil(0 + Math.random()* 255);
//         let val3 = Math.ceil(0 + Math.random()* 255);
//         return `rgb(${val1}, ${val2}, ${val3})`
//     }

//     pb.style.backgroundColor = getRandomColor()
// }, 800);


function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds.toString().split(".")[0];
    }
    else if (remainingSeconds > 10 && remainingSeconds < 60) {
        remainingSeconds = remainingSeconds.toString().split(".")[0];
    }
    return `${minutes}:${remainingSeconds}`;
}



async function getsongs(folder) {
    currentfolder = folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`))[1]

        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        // console.log(song);

        songul.innerHTML = songul.innerHTML + `<li>
                            <img src="music.svg" alt="">
                            <div class="info">
                                
                                <div> ${song[1].replaceAll("%20", " ")} </div>
                                
                            </div>
                            <div class="playnow">
                                <span>Play</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

            play.src = "play.svg"
        })

    })

}

let currentsong = new Audio()

const playmusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currentfolder}/` + track

    // if(!pause){
    //     currentsong.play()
    //     play.src = "pause.svg"
    //     play.addEventListener("click", ()=>{
    //         if(currentsong.paused){
    //             currentsong.play()
    //             play.src = "play.svg"
    //         }
    //         else{
    //             currentsong.pause()
    //             play.src = "pause.svg"
    //         }
    //     })
    // }

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = " "
    currentsong.play()

    
}

async function displayalbums(){
    let a = await fetch(`https://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML= response
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(async e=>{
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`https://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json()
            // console.log(response)
            let cardcontainer = document.querySelector(".cardcontainer")
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="new1" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35">

                                <circle cx="12" cy="12" r="12" fill="#00FF00" />


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </svg>
                        </div>

                        <img src="/songs/folder/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    })
}




async function main() {
    songs = await getsongs("songs/new1")

    // playmusic(songs[0],true)

    displayalbums()


    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "play.svg"
        }
        else {
            currentsong.pause()
            play.src = "pause.svg"
        }
    })


    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);

        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`

        document.querySelector(".circle").style.left = (((currentsong.currentTime) / (currentsong.duration)) * 100) + "%"

        document.querySelector(".seekbar").addEventListener("click", e => {
            document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%"

            currentsong.currentTime = ((currentsong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
        })
    })


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    vols.addEventListener("click", e => {
        currentsong.volume = (((e.offsetX) / (e.target.getBoundingClientRect().width)))
        document.querySelector(".volcircle").style.left = (((e.offsetX) / (e.target.getBoundingClientRect().width)) * 100) + "%"
    })

    volumebtn.addEventListener("click", () => {
        if (currentsong.volume == 0) {
            // console.log(document.querySelector(".volcircle").style.left.split("%")[0]);

            currentsong.volume = (document.querySelector(".volcircle").style.left.split("%")[0]) / 100
            volumebtn.src = "volume.svg"
        }
        else {
            currentsong.volume = 0
            volumebtn.src = "mute.svg"
        }
    })

    Array.from( document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })

}
main()
