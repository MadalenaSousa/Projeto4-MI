let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;

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

    client.login();
    songs = topSongs;

    totalSongs = Object.keys(songs).length;

    for(let i = 0; i < totalSongs; i++) {
        let list = document.createElement("div");
        list.innerText = songs[i].name;
        list.classList.add("song");
        document.querySelector(".list-songs").appendChild(list);
    }

    recordList = client.record.getList('all-songs');

    for (let i = 0; i < totalSongs; i++) {
        document.querySelectorAll(".song")[i].addEventListener("click", function () { //sempre que clico numa música
            record[i] = client.record.getRecord(songs[i].name); //crio um novo record no servidor
            record[i].set({ //defino o novo record
                user: "user",
                song: songs[i].name,
                x: (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i,
                y: height - (songs[i].duration / 2),
                raio: (songs[i].duration / 3),
                color: map(getAudioFeatures(i).positivity, 0, 1, 0, 255),
                energy: getAudioFeatures(i).energy * 5,
                url: songs[i].preview_url
            });

            recordList.addEntry(songs[i].name);
            //recordList.removeEntry(songs[i].name);
        });
    }

    recordList.subscribe(function () {
        if(recordList.isEmpty() === false) {
            var lastSong = recordList.getEntries()[recordList.getEntries().length-1];
            var currentRecord = client.record.getRecord(lastSong);

            currentRecord.whenReady(function () {
                console.log(recordList.getEntries());
                addNewFlower(currentRecord.get('song'), currentRecord.get('x'), currentRecord.get('y'), currentRecord.get('raio'), currentRecord.get('color'), currentRecord.get('energy'), currentRecord.get('energy'), currentRecord.get('url'));
            });
        }
    }, true);
}

function addNewFlower(name, x, y, raio, color, shakeX, shakeY, url) {
    newFlower = new flowerSong(name, x, y, raio, color, shakeX, shakeY, url);
    flowers.push(newFlower);
    console.log(flowers);
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

    constructor(name, x, y, raio, color, shakeX, shakeY, url) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color  = color;
        this.shakeX = shakeX;
        this.shakeY = shakeY;

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
        text(this.name, this.x, this.y);
    }

    playSong() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.musicOn = !this.musicOn;
        }
    }
}