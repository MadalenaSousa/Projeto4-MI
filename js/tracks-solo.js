let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;

let allLoudness = [];
let allPositivity = [];
let allSpeed = [];
let allDanceability = [];

let allBarsTotal = [];
let allBeatsTotal = [];
let allTatumsTotal = [];

let allBarsDuration = [];
let allBeatsDuration = [];
let allTatumsDuration = [];


function preload() {
    //playlistSongs = loadJSON('php/' + userid +'-playlist-songs-object.json');
    topSongs = loadJSON('php/' + userid + '-top-songs-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth / 6, windowHeight);
    songs = topSongs;
    totalSongs = Object.keys(songs).length;

    createUserDiv(user.name, user.profile_pic);
    createSongDiv();
    logoutPopUp();
    sharePopUp();
    createPlaylistPopUp();

    remove = document.querySelectorAll(".remove");

    for (let i = 0; i < totalSongs; i++) {
        allPositivity[i] = getAudioFeatures(i).positivity;
        allLoudness[i] = getAudioFeatures(i).loudness;
        allSpeed[i] = getAudioFeatures(i).speed;
        allDanceability[i] = getAudioFeatures(i).danceability;

        allBarsTotal[i] = getAudioAnalysis(i).bars.total;
        allBeatsTotal[i] = getAudioAnalysis(i).beats.total;
        allTatumsTotal[i] = getAudioAnalysis(i).tatums.total;

        allBarsDuration[i] = getAudioAnalysis(i).bars.average_duration;
        allBeatsDuration[i] = getAudioAnalysis(i).beats.average_duration;
        allTatumsDuration[i] = getAudioAnalysis(i).tatums.average_duration;
    }

    for (let i = 0; i < totalSongs; i++) {
        document.querySelectorAll(".song")[i].addEventListener("click", function () {
            let flowersId = [];
            for(let z = 0; z < flowers.length; z++) {
                flowersId.push(flowers[z].id);
            }
            if(contains(flowersId, songs[i].id) === false) {
                addNewFlower(
                    songs[i].id,
                    songs[i].name,
                    map(getAudioFeatures(i).speed, min(allSpeed), max(allSpeed), 120, width - 200),
                    map(allLoudness[i], min(allLoudness), max(allLoudness), height - 80, 80),
                    map(allLoudness[i], min(allLoudness), max(allLoudness), height - 80, 80),
                    (songs[i].duration / 3),
                    map(allPositivity[i], min(allPositivity), max(allPositivity), 0, 255),
                    getAudioFeatures(i).energy * 5,
                    getAudioFeatures(i).speed / 5,
                    allDanceability[i],
                    songs[i].preview_url,
                    songs[i].artists,
                    user.name,
                    getAudioAnalysis(i).sections.tempo,
                    getAudioAnalysis(i).sections.durations,
                    getAudioAnalysis(i).sections.loudness,
                    map(allBeatsTotal[i], min(allBeatsTotal), max(allBeatsTotal), 3, 5),
                    map(allBeatsDuration[i], min(allBeatsDuration), max(allBeatsDuration), 30, 50),
                    getAudioAnalysis(i).sections.total,
                    songs[i].mode);

                remove[i].classList.remove('hide');
            }
        });

        remove[i].addEventListener("click", function () {
            removeFlower(songs[i].name);
            remove[i].classList.add('hide');
        });
    }

    document.querySelector('.confirm-logout').addEventListener('click', function () {
        document.location = './homepage.php';
    });

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        resizeCanvas(windowHeight, windowHeight);
        saveCanvas('solo-tracks-artboard.png');
        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);
    });

}


document.querySelector('.info').addEventListener('click', abrirPopupInfo);
document.querySelector('.fechar-info').addEventListener('click', fecharPopupInfo);


function abrirPopupInfo(){
    document.querySelector('.popup-info').style.display = "block";
    document.querySelector('.overlay').classList.remove('hide');
}

function fecharPopupInfo(){
    document.querySelector('.popup-info').style.display = "none";
    document.querySelector('.overlay').classList.add('hide');
}

function addNewFlower(id, name, x, y, pY, raio, color, energy, speed, danceability, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode) {
    newFlower = new flowerSong(id, name, x, y, pY, raio, color, energy, speed, danceability, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode);
    flowers.push(newFlower);
    console.log("LISTA DE FLORES ATUAL: " + flowers);
}

function removeFlower(song) {
    for (let i = 0; i < flowers.length; i++) {
        if (flowers[i].name === song) {
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
        document.querySelector('.logout').classList.remove('hide');
        document.querySelector('.overlay').classList.remove('hide');
    });

    document.querySelector(".back").addEventListener('click', function () {
        document.querySelector('.logout').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });

    document.querySelector(".close-logout").addEventListener('click', function () {
        document.querySelector('.logout').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });
}

function sharePopUp() {
    document.querySelector('.share-button').addEventListener('click', function () {
        document.querySelector('.share').classList.remove('hide');
        document.querySelector('.overlay').classList.remove('hide');

        cleanCreatePlaylistPreview();
        resizeCanvas(windowHeight, windowHeight);
        let canvas = document.getElementById('defaultCanvas0');
        let img = new Image(100, 100);
        img.src = canvas.toDataURL('image/jpeg', 0.01);
        img.classList.add('contorno');
        document.querySelector('.preview').appendChild(img);
        resizeCanvas(windowWidth - windowWidth/6, windowHeight);
    });

    document.querySelector(".close-share").addEventListener('click', function () {
        document.querySelector('.share').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });
}

function createPlaylistPopUp() {
    document.querySelector(".create-button").addEventListener('click', function () {

        cleanCreatePlaylistList();
        cleanCreatePlaylistPreview();
        let totalSongs = document.createElement('input');
        totalSongs.setAttribute('type', 'hidden');
        totalSongs.setAttribute('name', 'songTotal');
        totalSongs.setAttribute('value', flowers.length);

        document.querySelector('.create-playlist form').appendChild(totalSongs);

        for (let i = 0; i < flowers.length; i++) {
            createPlaylistSongList(i);
        }

        let canvas = document.getElementById('defaultCanvas0');
        let img = new Image(200, 200);
        img.src = canvas.toDataURL('image/jpeg', 0.01);
        localStorage.setItem(canvas, canvas.toDataURL());
        document.querySelector('.preview').appendChild(img);

        let playlistImg = document.createElement('input');
        playlistImg.setAttribute('type', 'hidden');
        playlistImg.setAttribute('name', 'playlistImg');
        playlistImg.setAttribute('value', img.src);

        document.querySelector('.create-playlist form').appendChild(playlistImg);

        document.querySelector('.create-playlist').classList.remove('hide');
        document.querySelector('.overlay').classList.remove('hide');
    });

    document.querySelector(".close-create").addEventListener('click', function () {
        document.querySelector('.create-playlist').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });
}

function cleanCreatePlaylistList() {
    let arrayDivs = document.querySelectorAll('.added-songs-list div');

    for (let i = 0; i < arrayDivs.length; i++) {
        arrayDivs[i].remove();
    }
}

function cleanCreatePlaylistPreview() {
    let arrayDivs = document.querySelectorAll('.preview-create img');

    for(let i = 0; i < arrayDivs.length; i++) {
        arrayDivs[i].remove();
    }
}

function createPlaylistSongList(index) {
    let songDiv = document.createElement('div');

    let songInput = document.createElement('input');
    songInput.setAttribute('type', 'checkbox');
    songInput.setAttribute('name', 'song' + index);
    songInput.setAttribute('checked', 'true');

    let songLabel = document.createElement('label');
    songLabel.innerText = flowers[index].name;

    let songId = document.createElement('input');
    songId.setAttribute('type', 'hidden');
    songId.setAttribute('name', 'songId' + index);
    songId.setAttribute('value', flowers[index].id);

    songLabel.appendChild(songInput);

    songDiv.appendChild(songLabel);
    songDiv.appendChild(songId);

    document.querySelector('.added-songs-list').appendChild(songDiv);
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
    for (let i = 0; i < totalSongs; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");
        let artista = document.createElement("div");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('song');

        nome.innerHTML = '<b>' + songs[i].name + '</b>';

        artista.setAttribute("style", "font-size: 10pt");
        artista.innerHTML = songs[i].artists;

        nomeDiv.appendChild(nome);
        nomeDiv.appendChild(artista);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.classList.add("removeSongs");
        remove.classList.add("hide");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        song.classList.add('unit');

        song.appendChild(nomeDiv);
        song.appendChild(remove);
        document.querySelector(".list-songs").appendChild(song);
    }
}

window.addEventListener('resize', function () {
    w = window.innerWidth - window.innerWidth / 6;
    h = window.innerHeight;
    resizeCanvas(w, h);
});

document.querySelector('.close-url').addEventListener('click', function () {
    document.querySelector('.no-url').classList.add('hide');
    document.querySelector('.overlay').classList.add('hide');
});

function draw() {
    background(0);

    if (fromPlaylist) {
        songs = playlistSongs;
        totalSongs = Object.keys(songs).length;
    } else {
        songs = topSongs;
        totalSongs = Object.keys(songs).length;
    }

    if (flowers.length > 0) {
        for (let i = 0; i < flowers.length; i++) {
            flowers[i].display();
        }

        for(let i = 0; i < flowers.length; i++) {
            if(dist(mouseX, mouseY, flowers[i].x, flowers[i].y) <= 120) {
                flowers[i].balao();
            }
        }
    }
}

function mousePressed() {
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].playSong();
    }
}

function getAudioFeatures(index) {
    return songs[index].audio_features;
}

function getAudioAnalysis(index) {
    return songs[index].audio_analysis;
}

class flowerSong {
    c;
    randomX;
    randomY;
    musicOn;
    sound;
    randflower;
    curves;
    theta;

    constructor(id, name, x, y, pY, raio, color, energy, speed, danceability, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color = color;
        this.shakeX = energy;
        this.shakeY = energy;
        this.speed = speed;
        this.danceability = danceability;
        this.artist = artist;
        this.owner = owner;
        this.mode = mode;
        this.nBeats = nBeats;
        this.rBeats = rBeats;
        this.numberSections = numberSections;
        this.arraySectionLoudness = arraySectionLoudness;
        this.pY = pY;
        this.theta = TWO_PI / (nBeats * 2);

        this.curves = [];
        this.randflower = new randFlower(arraySectionTempo, arraySectionDuration, arraySectionLoudness, this.curves, x, y, this.numberSections, mode);

        this.url = url;
        this.sound = new Audio(url);
        this.musicOn = false;
    }

    display() {
        this.c = color(255, 255, 255 - this.color);
        stroke(this.c);
        this.flor(this.x, this.y, this.nBeats, this.rBeats, this.mode, this.theta);

        if (dist(mouseX, mouseY, this.x, this.y) <= 120) {
            this.randomX = random(-this.shakeX, this.shakeX);
            this.randomY = random(-this.shakeY, this.shakeY);
            this.botaoPlay(this.x, this.y, this.musicOn);
        } else {
            this.randomX = 0;
            this.randomY = 0;
        }

        if (this.musicOn) {
            this.sound.play();
            if(this.url === null) {
                document.querySelector('.no-url').classList.remove('hide');
                document.querySelector('.overlay').classList.remove('hide');
                console.log('BOSTA');
                this.musicOn = false;
            }
        } else {
            this.sound.pause();
        }

        if (this.mode === 1) {
            noStroke();
            fill(this.c);
            textSize(14);
            textStyle(BOLD);
            text(this.name, this.x, this.y + 50);
            textSize(12);
            textStyle(NORMAL);
            text(this.artist, this.x, this.y + 60);
        } else {
            noStroke();
            fill(this.c);
            textSize(14);
            textStyle(BOLD);
            text(this.name, this.x, this.y - 60);
            textSize(12);
            textStyle(NORMAL);
            text(this.artist, this.x, this.y - 50);
        }


        //this.theta = this.theta + TWO_PI/(this.nBeats*100);
    }

    playSong() {
        if (dist(mouseX, mouseY, this.x, this.y) <= this.raio) {
            this.musicOn = !this.musicOn;
        }
    }

    flor(x, y, nBeats, rBeats, mode, theta) {
        strokeWeight(2);
        fill(255, 30);

        //LINHA + ORIENTAÇÃO DAS FLORES
        if (mode === 1) {
            if (this.pY < height) {
                this.pY = this.pY + this.speed;
            } else {
                this.pY = height;
            }
            line(x, y, x, height);
        } else {
            if (this.pY > 0) {
                this.pY = this.pY - this.speed;
            } else {
                this.pY = 0;
            }
            line(x, y, x, 0);
        }

        //SECTIONS
        for (let c = 0; c < this.curves.length; c++) {
            this.curves[c].display(this.randomX, this.randomY);
        }

        //BEATS
        for (let i = 0; i < nBeats * 2; i++) {
            let xB = x + rBeats / 1.5 * cos(i * theta);
            let yB = y + rBeats / 1.5 * sin(i * theta);
            line(x, y, xB + this.randomX, yB + this.randomY);
            fill(255);
            ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
        }
    }

    botaoPlay(x, y, state) {
        fill(0);
        if(state === true) {
            rectMode(CENTER);
            rect(x - 8, y, 8, 20);
            rect(x + 8, y, 8, 20);
        } else {
            triangle(x - 8, y - 10, x - 8, y + 10, x + 10, y);
        }
    }

    balao() {
        fill(0);
        strokeWeight(2);
        stroke(this.c);
        rectMode(CORNER);
        if (this.y - 210 > 0) {
            beginShape();
            vertex(this.x + 20, this.y - 210);
            vertex(this.x + 150, this.y - 210);
            vertex(this.x + 150, this.y - 50);
            vertex(this.x + 50, this.y - 50);
            vertex(this.x + 40, this.y - 25);
            vertex(this.x + 30, this.y - 50);
            vertex(this.x + 20, this.y - 50);
            endShape(CLOSE);

            noStroke();
            fill(this.c);
            textStyle(BOLD);
            textSize(12);
            text("Added by " + split(this.owner, ' ')[0], this.x + 30, this.y - 190);
            textStyle(NORMAL);
            text("Energy: " + map(this.shakeX, 0, 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 170);
            text("Danceability: " + map(this.danceability, 0, 1, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 150);
            text("Positivity: " + map(this.color, 0, 255, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 130);
            text("Loudness: " + map(this.y, height, 0, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 110);
            text("Speed: " + map(this.speed, min(allSpeed) / 5, max(allSpeed) / 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 90); //MAL MAPEADO

            if (mouseX > this.x + 30 && mouseX < this.x + 120 && mouseY > this.y - 80 && mouseY < this.y - 60) {
                fill(this.c);
                stroke(this.c);
                rect(this.x + 30, this.y - 80, 110, 20);
                noStroke();
                fill(0);
                textSize(10);
                textStyle(BOLD);
                text("SAVE SONG", this.x + 60, this.y - 65);
                if (mouseIsPressed) {
                    window.location = 'php/addToMySongs.php?id=' + this.id;
                }
            } else {
                fill(0);
                stroke(this.c);
                rect(this.x + 30, this.y - 80, 110, 20);
                noStroke();
                fill(this.c);
                textSize(10);
                text("SAVE SONG", this.x + 60, this.y - 65);
            }

        } else {
            beginShape();
            vertex(this.x + 20, this.y + 30);
            vertex(this.x + 30, this.y + 30);
            vertex(this.x + 40, this.y + 5);
            vertex(this.x + 50, this.y + 30);
            vertex(this.x + 150, this.y + 30);
            vertex(this.x + 150, this.y + 190);
            vertex(this.x + 20, this.y + 190);
            endShape(CLOSE);

            noStroke();
            fill(this.c);
            textStyle(BOLD);
            textSize(12);
            text("Added by " + split(this.owner, ' ')[0], this.x + 30, this.y + 80);
            textStyle(NORMAL);
            text("Energy: " + map(this.shakeX, 0, 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 100);
            text("Danceability: " + map(this.danceability, 0, 1, 10, 100).toFixed(1) + "%", this.x + 30, this.y + 120);
            text("Positivity: " + map(this.color, 0, 255, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 140);
            text("Loudness: " + map(this.y, height, 0, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 160);
            text("Speed: " + map(this.speed, min(allSpeed) / 5, max(allSpeed) / 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 180);

            if (mouseX > this.x + 30 && mouseX < this.x + 120 && mouseY > this.y + 40 && mouseY < this.y + 60) {
                fill(this.c);
                stroke(this.c);
                rect(this.x + 30, this.y + 40, 110, 20);
                noStroke();
                fill(0);
                textSize(10);
                textStyle(BOLD);
                text("SAVE SONG", this.x + 50, this.y + 55);
                if (mouseIsPressed) {
                    window.location = 'php/addToMySongs.php?id=' + this.id;
                }
            } else {
                fill(0);
                stroke(this.c);
                rect(this.x + 30, this.y + 40, 110, 20);
                noStroke();
                fill(this.c);
                textSize(10);
                text("SAVE SONG", this.x + 50, this.y + 55);
            }
        }


    }
}

class randFlower {

    constructor(arraySectionTempo, arraySectionDuration, arraySectionLoudness, curves, x, y, linenum, mode) {
        this.x = x;
        this.y = y;
        this.linenum = linenum; //numero de sections
        this.mode = mode;
        for (let i = 0; i < this.linenum; i++) {
            this.theta = map(arraySectionTempo[i], min(arraySectionTempo), max(arraySectionTempo), 0, arraySectionTempo[i] * TWO_PI);
            this.d = map(arraySectionLoudness[i], min(arraySectionLoudness), max(arraySectionLoudness), 80, 120); //loudness da section
            this.hy = sin(this.theta);
            this.hx = cos(this.theta);
            this.ex = this.d * this.hx + this.x;
            this.ey = this.d * this.hy + this.y;

            for (let z = 0; z < 2; z++) {
                if (z === 0) {
                    this.bow = map(arraySectionDuration[i], min(arraySectionDuration), max(arraySectionDuration), 20, 50); //duração da section
                } else if (z === 1) {
                    this.bow = -map(arraySectionDuration[i], min(arraySectionDuration), max(arraySectionDuration), 20, 50);
                }
                curves.push(new Curve(x, y, this.ex, this.ey, this.bow));
            }
        }
    }
}

class Curve { //preenchimento

    constructor(sx, sy, ex, ey, bow) {
        this.bow = bow;
        this.one = createVector(sx, sy);
        this.two = createVector(ex, ey);
        this.diff = p5.Vector.sub(this.two, this.one);
        this.midPt = p5.Vector.mult(p5.Vector.add(this.one, this.two), 0.5);
        this.upV = createVector(0, 0, 1);
        this.cross = ((this.diff.cross(this.upV)).normalize()).mult(this.bow);
        this.controlPt = p5.Vector.add(this.midPt, this.cross);
    }

    display(randX, randY) {
        noFill();
        strokeWeight(2);

        bezier(this.one.x, this.one.y, this.controlPt.x, this.controlPt.y, this.controlPt.x, this.controlPt.y, this.two.x + randX, this.two.y + randY);
    }
}