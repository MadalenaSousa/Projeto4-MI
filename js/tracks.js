let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;
let flowerExists = false;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;

function preload() {
    playlistSongs = loadJSON('php/playlist-songs-object.json');
    topSongs = loadJSON('php/top-songs-object.json');
    user = loadJSON('php/user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);
    client.login({username: user.name});
    songs = topSongs;

    totalSongs = Object.keys(songs).length;

    for(let i = 0; i < totalSongs; i++) {
        let list = document.createElement("div");
        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");
        let remove = document.createElement("span");
        let artista = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nome.innerHTML ='<b>' + songs[i].name + '</b>';
        remove.innerText = "x";
        remove.classList.add("remove");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        nomeDiv.appendChild(nome);
        nomeDiv.appendChild(remove);

        nome.classList.add("song");

        artista.setAttribute("style", "font-size: 10pt");
        artista.innerHTML = songs[i].artists;

        list.appendChild(nomeDiv);
        list.appendChild(artista);
        document.querySelector(".list-songs").appendChild(list);
    }

    remove = document.querySelectorAll(".remove");

    client.presence.subscribe((username, isLoggedIn) => {
        if(isLoggedIn){
            client.presence.getAll((clients) => {
                for(let i = 0; i < clients.length; i++){
                    let peopleList = document.createElement('div');
                    peopleList.innerText = username;
                    peopleList.classList.add("user");

                    document.querySelector(".list-people").appendChild(peopleList);
                }
            });
        }
    });

    recordList = client.record.getList('all-songs');

    for (let i = 0; i < totalSongs; i++) {
        document.querySelectorAll(".song")[i].addEventListener("click", function () { //sempre que clico numa música
            if(client.record.has(songs[i].name)) {
            } else {
                record[i] = client.record.getRecord(songs[i].name); //crio um novo record no servidor
                record[i].set({ //defino o novo record
                    user: "user",
                    song: songs[i].name,
                    x: (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i,
                    y: height - (songs[i].duration / 2),
                    raio: (songs[i].duration / 3),
                    color: map(getAudioFeatures(i).positivity, 0, 1, 0, 255),
                    energy: getAudioFeatures(i).energy * 5,
                    artist: songs[i].artists,
                    url: songs[i].preview_url
                });

                recordList.addEntry(songs[i].name);
            }
            //recordList.removeEntry(songs[i].name);
        });

        remove[i].addEventListener("click", function () {
            recordList.removeEntry(songs[i].name);
            removeFlower(i);
            console.log(recordList.getEntries());
            console.log(flowers);
        });
    }

    recordList.subscribe(function () {
        if(recordList.isEmpty() === false && flowerExists === false) {
            var currentRecord = [];
            for(let i = 0; i < recordList.getEntries().length; i++) {
                currentRecord[i] = client.record.getRecord(recordList.getEntries()[i]);
                currentRecord[i].whenReady(function () {
                    console.log(recordList.getEntries());
                    addNewFlower(currentRecord[i].get('song'), currentRecord[i].get('x'), currentRecord[i].get('y'), currentRecord[i].get('raio'), currentRecord[i].get('color'), currentRecord[i].get('energy'), currentRecord[i].get('energy'), currentRecord[i].get('url'), currentRecord[i].get('artist'));
                });
            }
        }
    }, true);
}

function addNewFlower(name, x, y, raio, color, shakeX, shakeY, url, artist) {
    newFlower = new flowerSong(name, x, y, raio, color, shakeX, shakeY, url, artist);
    flowers.push(newFlower);
    console.log(flowers);
}

function removeFlower(index) {
    flowers.splice(index, 1);
}

function contains(array, obj) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function draw() {
    background(0);

    if(fromPlaylist) {
        songs = playlistSongs;
        totalSongs = Object.keys(songs).length;
    } else {
        songs = topSongs;
        totalSongs = Object.keys(songs).length;
    }

    if(client.record.has("Black Madonna")){
        console.log("NÃO TEM");
    }

    if(flowers.length > 0) {
        for(let i = 0; i < flowers.length; i++) {
            flowers[i].display();
        }
    }
}

function mousePressed() {
    for(let i = 0; i < flowers.length; i++) {
        flowers[i].playSong();
    }
}

function getAudioFeatures(index) {
    return songs[index].audio_features;
}

class flowerSong {
    c;
    randomX;
    randomY;
    musicOn;
    sound;

    constructor(name, x, y, raio, color, shakeX, shakeY, url, artist) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color  = color;
        this.shakeX = shakeX;
        this.shakeY = shakeY;
        this.artist = artist;

        this.sound = new Audio(url);
        this.musicOn = false;
    }

    display() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.c = color(255, 255, this.color);
            this.randomX = random(-this.shakeX, this.shakeX);
            this.randomY = random(-this.shakeY, this.shakeY);

        } else {
            this.c = color(255);
            this.randomX = 0;
            this.randomY = 0;
        }

        if(this.musicOn){
            this.sound.play();
        } else {
            this.sound.pause();
        }

        stroke(this.c);
        strokeWeight(3);
        noFill();
        ellipse(this.x + this.randomX, this.y + this.randomY, this.raio * 2, this.raio * 2);

        noStroke();
        fill(this.c);
        textSize(12);
        textStyle(BOLD);
        text(this.name, this.x, this.y);
        textSize(10);
        textStyle(NORMAL);
        text(this.artist, this.x, this.y + 10);
    }

    playSong() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.musicOn = !this.musicOn;
        }
    }
}