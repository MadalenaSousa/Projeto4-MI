let playlistSongs, topSongs, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;

const client = new DeepstreamClient('localhost:6020');
const record = [];

function preload() {
    playlistSongs = loadJSON('php/playlist-songs-object.json');
    topSongs = loadJSON('php/top-songs-object.json');
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

    for (let i = 0; i < totalSongs; i++) {
        document.querySelectorAll(".song")[i].addEventListener("click", function () {
            newFlower = new flowerSong(songs[i].name, (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i, height - (songs[i].duration / 2), (songs[i].duration / 3), map(getAudioFeatures(i).positivity, 0, 1, 0, 255), getAudioFeatures(i).energy * 5, getAudioFeatures(i).energy * 5, songs[i].preview_url);
            flowers.push(newFlower);

            record[i] = client.record.getRecord(client.getUid());
            record[i].set({
                song: songs[i].name,
                x: (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i,
                y: height - (songs[i].duration / 2),
                raio: (songs[i].duration / 3),
                url: songs[i].preview_url
            });

            console.log("nova info: " + client.record.getRecord(client.getUid()));
        });
    }
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

    for(let i = 0; i < flowers.length; i++) {
        flowers[i].display();
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