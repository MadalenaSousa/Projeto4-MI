let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;

function preload() {
    playlistSongs = loadJSON('php/' + userid +'-playlist-songs-object.json');
    topSongs = loadJSON('php/' + userid + '-top-songs-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);
    songs = topSongs;
    totalSongs = Object.keys(songs).length;

    createUserDiv(user.name, user.profile_pic);
    createSongDiv();
    logoutPopUp();
    sharePopUp();

    remove = document.querySelectorAll(".remove");

    for (let i = 0; i < totalSongs; i++) {
        document.querySelectorAll(".song")[i].addEventListener("click", function () {
            addNewFlower(songs[i].name, (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i, height - (songs[i].duration / 2), (songs[i].duration / 3),
                    map(getAudioFeatures(i).positivity, 0, 1, 0, 255), getAudioFeatures(i).energy * 5, getAudioFeatures(i).energy * 5, songs[i].preview_url, songs[i].artists);
            remove[i].classList.remove('hide');
        });

        remove[i].addEventListener("click", function () {
            removeFlower(songs[i].name);
            remove[i].classList.add('hide');
        });
    }
}

function addNewFlower(name, x, y, raio, color, shakeX, shakeY, url, artist) {
    newFlower = new flowerSong(name, x, y, raio, color, shakeX, shakeY, url, artist);
    flowers.push(newFlower);
    console.log("LISTA DE FLORES ATUAL: " + flowers);
}

function removeFlower(song) {
    for(let i = 0; i < flowers.length; i++){
        if(flowers[i].name === song) {
            flowers.splice(i, 1);
        }
    }
}

function contains(array, nome) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === nome) {
            return true;
        }
    }
    return false;
}

function logoutPopUp() {
    document.querySelector(".leave").addEventListener('click', function () {
        document.querySelector('.logout').classList.toggle('hide');
    });

    document.querySelector(".back").addEventListener('click', function () {
        document.querySelector('.logout').classList.add('hide');
    });
}

function sharePopUp() {
    document.querySelector('.share-button').addEventListener('click', function () {
        document.querySelector('.share').classList.toggle('hide');
    });

    document.querySelector(".close-share").addEventListener('click', function () {
        document.querySelector('.share').classList.add('hide');
    });
}

function createUserDiv(name, profilepic) {
    let userDiv = document.createElement('div');
    let person = document.createElement('div');
    let img = document.createElement('img');

    img.setAttribute('src', profilepic);
    img.setAttribute('width', '30px');
    img.setAttribute('height', '30px');

    person.innerText = name;
    person.classList.add('username');

    userDiv.classList.add('user');
    userDiv.appendChild(img);
    userDiv.appendChild(person);

    document.querySelector(".list-people").appendChild(userDiv);
}

function createSongDiv() {
    for(let i = 0; i < totalSongs; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");
        let artista = document.createElement("div");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('song');

        nome.innerHTML ='<b>' + songs[i].name + '</b>';

        artista.setAttribute("style", "font-size: 10pt");
        artista.innerHTML = songs[i].artists;

        nomeDiv.appendChild(nome);
        nomeDiv.appendChild(artista);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.classList.add("hide");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        song.classList.add('unit');

        song.appendChild(nomeDiv);
        song.appendChild(remove);
        document.querySelector(".list-songs").appendChild(song);
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
        strokeWeight(2);
        noFill();
        //ellipse(this.x + this.randomX, this.y + this.randomY, this.raio * 2, this.raio * 2);
        for (let i = 0; i < 4; i++) {
            this.flor(this.x + this.randomX, this.y + this.randomY, 10, 60-i*15, 65-i*15);
        }

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

    flor(x, y, nVert, rG, rP) {
        let alpha = TWO_PI/nVert;
        beginShape();
        for (let i = 0; i <= nVert+1; i++) {
            curveVertex(x+rG*cos(i*alpha), y+rG*sin(i*alpha));
            curveVertex(x+rP*cos(i*alpha+alpha/2), y+rP*sin(i*alpha+alpha/2));
        }
        endShape();
    }
}