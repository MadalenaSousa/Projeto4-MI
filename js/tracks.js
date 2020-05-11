let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;

let allLoudness = [];

let allBarsTotal = [];
let allBeatsTotal = [];
let allTatumsTotal = [];

let allBarsDuration = [];
let allBeatsDuration = [];
let allTatumsDuration = [];

const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

function preload() {
    //playlistSongs = loadJSON('php/' + userid +'-playlist-songs-object.json');
    topSongs = loadJSON('php/' + userid + '-top-songs-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);
    client.login({username: user.name}, (success, data) => {
        if(success) {
            console.log("User logged in successfully");
            client.record.has(user.name, function (error, hasRecord) {
                console.log(error);
                if(hasRecord === false) {
                    console.log("Record of this user doesnt exist, it will be created");
                    personRecord = client.record.getRecord(user.name);
                    personRecord.set({
                        name: user.name,
                        id: user.id,
                        profile_pic: user.profile_pic
                    });
                } else {
                    console.log("A record of this user already exists, it will be retrieved");
                    personRecord = client.record.getRecord(user.name);
                }
            });
        } else {
            console.log('Login failed');
        }
    });

    client.presence.getAll((error, clients) => {
        for(let i = 0; i < clients.length; i++){
            console.log('Clients present on login: ' + clients);
            clientsRecords[i] = client.record.getRecord(clients[i]);
            clientsRecords[i].subscribe(function () {
                createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
            });
        }
    });

    client.presence.subscribe((username, isLoggedIn) => {
        if(isLoggedIn){
            console.log('A new client logged in');
            clearArray(clientsRecords);
            client.presence.getAll((error, clients) => {
                for(let i = 0; i < clients.length; i++){
                    console.log('Updated clients list: ' + clients);
                    clientsRecords[i] = client.record.getRecord(clients[i]);
                    clientsRecords[i].subscribe(function () {
                        createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
                    });
                }
            });
        }
    });

    songs = topSongs;
    totalSongs = Object.keys(songs).length;

    createUserDiv(user.name, user.profile_pic);
    createSongDiv();
    logoutPopUp();
    sharePopUp();

    recordList = client.record.getList('all-songs');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if(recordList.isEmpty()) {
            clearArray(flowers);
            console.log("Não há músicas na lista");
        } else {
            clearArray(flowers);
            let recordsOnList = [];
            for(let i = 0; i < recordList.getEntries().length; i++){
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    addNewFlower(recordsOnList[i].get('song'), recordsOnList[i].get('x'), recordsOnList[i].get('y'), recordsOnList[i].get('raio'), recordsOnList[i].get('color'),
                        recordsOnList[i].get('energy'), recordsOnList[i].get('url'), recordsOnList[i].get('artist'), recordsOnList[i].get('user'),
                        recordsOnList[i].get('nBars'), recordsOnList[i].get('nBeats'), recordsOnList[i].get('nTatums'),
                        recordsOnList[i].get('rBars'), recordsOnList[i].get('rBeats'), recordsOnList[i].get('rTatums'), recordsOnList[i].get('mode'));
                });
            }
        }
    });

    for(let i = 0; i < totalSongs; i++) {
        allLoudness[i] = getAudioFeatures(i).loudness;

        allBarsTotal[i] = getAudioAnalysis(i).bars.total;
        allBeatsTotal[i] = getAudioAnalysis(i).beats.total;
        allTatumsTotal[i] = getAudioAnalysis(i).tatums.total;

        allBarsDuration[i] = getAudioAnalysis(i).bars.average_duration;
        allBeatsDuration[i] = getAudioAnalysis(i).beats.average_duration;
        allTatumsDuration[i] = getAudioAnalysis(i).tatums.average_duration;
    }

    for (let i = 0; i < totalSongs; i++) {
        recordList.subscribe(function () {
            if(contains(recordList.getEntries(), songs[i].name)){
                remove[i].classList.remove('hide');
            } else {
                remove[i].classList.add('hide');
            }
        });

        document.querySelectorAll(".song")[i].addEventListener("click", function () {
            client.record.has(songs[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + songs[i].name + ", can create it");
                    record[i] = client.record.getRecord(songs[i].name);
                    record[i].set({
                        user: user.name,
                        song: songs[i].name,
                        x: (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i,
                        y: map(allLoudness[i], min(allLoudness), max(allLoudness), height, 0),
                        raio: (songs[i].duration / 3),
                        color: map(getAudioFeatures(i).positivity, 0, 1, 0, 255),
                        energy: getAudioFeatures(i).energy * 5,
                        artist: songs[i].artists,
                        url: songs[i].preview_url,
                        nBars: getAudioAnalysis(i).bars.total / 30, //ISTO TÁ MUITA FEIO -> CORRIGIR RAPIDEX
                        nBeats: getAudioAnalysis(i).beats.total / 50,
                        nTatums: getAudioAnalysis(i).tatums.total / 50,
                        rBars: getAudioAnalysis(i).bars.average_duration * 10,
                        rBeats: getAudioAnalysis(i).beats.average_duration * 120,
                        rTatums: getAudioAnalysis(i).tatums.average_duration * 200,
                        mode: songs[i].mode
                    });

                    recordList.addEntry(songs[i].name);

                    record[i].whenReady(function () {
                        console.log(record[i]);
                    });

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + songs[i].name + ", already exists, cannot create it");
                }
            });

        });

       remove[i].addEventListener("click", function () {
            client.record.has(songs[i].name, function (error, hasRecord) {
                if (hasRecord) {
                    console.log('Has record with name: ' + songs[i].name + ', can delete it');

                    recordList.removeEntry(songs[i].name);
                    client.record.getRecord(songs[i].name).delete();

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Doesnt have record with name: ' + songs[i].name + ', cannot delete it');
                }
            });
        });
    }

    document.querySelector('.confirm-logout').addEventListener('click', closeSongsRoomConnection);

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        saveCanvas( 'public-tracks-artboard.png');
    });
}

function addNewFlower(name, x, y, raio, color, energy, url, artist, owner, nBars, nBeats, nTatums, rBars, rBeats, rTatums, mode) {
    newFlower = new flowerSong(name, x, y, raio, color, energy, url, artist, owner, nBars, nBeats, nTatums, rBars, rBeats, rTatums, mode);
    flowers.push(newFlower);
    console.log("LISTA DE FLORES ATUAL: " + flowers);
}

function clearArray(array) {
    array.splice(0, array.length);
}

function contains(array, nome) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === nome) {
            return true;
        }
    }
    return false;
}

function closeSongsRoomConnection() {
    let allRecords = [];
    let recordsToRemove = [];

    for(let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('song') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }

    if(recordsToRemove.length === 0) {
        client.close();
    } else {
        for(let i = 0; i < recordsToRemove.length; i++) {
            recordList.removeEntry(recordsToRemove[i].get('song'));
            client.record.getRecord(recordsToRemove[i].get('song')).delete();
        }

        recordsToRemove[recordsToRemove.length - 1].on('delete', function () {
            client.close();
        });
    }

    client.on('connectionStateChanged', connectionState => {
        if(connectionState === 'CLOSED') {
            console.log('Connection state changed to: ' + connectionState + ', you will be redirected to homepage');
            document.location = './homepage.php';
        }
    });
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

function getAudioAnalysis(index) {
    return songs[index].audio_analysis;
}

class flowerSong {
    c;
    randomX;
    randomY;
    musicOn;
    sound;

    constructor(name, x, y, raio, color, energy, url, artist, owner, nBars, nBeats, nTatums, rBars, rBeats, rTatums, mode) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color  = color;
        this.shakeX = energy;
        this.shakeY = energy;
        this.artist = artist;
        this.owner = owner;
        this.nBars = nBars;
        this.nBeats = nBeats;
        this.nTatums = nTatums;
        this.rBars = rBars;
        this.rBeats = rBeats;
        this.rTatums = rTatums;
        this.mode = mode;

        this.sound = new Audio(url);
        this.musicOn = false;
    }

    display() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.c = color(255, 255, 255 - this.color);
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
        this.flor(this.x + this.randomX, this.y + this.randomY, this.nBars, this.nBeats, this.nTatums, this.rBars, this.rBeats, this.rTatums);

        noStroke();
        fill(this.c);
        textSize(12);
        textStyle(BOLD);
        text(this.name, this.x, this.y);
        textSize(10);
        textStyle(NORMAL);
        text(this.artist, this.x, this.y + 10);

        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio) {
            this.balao();
        }
    }

    playSong() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.musicOn = !this.musicOn;
        }
    }

    flor(x, y, nBars, nBeats, nTatums, rBars, rBeats, rTatums, mode) {
        strokeWeight(1);
        fill(0);



        let delta = -TWO_PI/(nBeats*2);
        let rPBeats = rBeats/2;
        for(let i = 0; i < nBeats*2; i++){
            let anchor1x = this.x;
            let anchor1y = this.y;
            let ctrl1x = this.x + rPBeats * cos((i-1)*delta);
            let ctrl1y = this.y + rPBeats * sin((i-1)*delta);
            let ctrl2x = this.x + rPBeats * cos((i+1)*delta);
            let ctrl2y = this.y + rPBeats * sin((i+1)*delta);
            let anchor2x = this.x + rBeats * cos(i*delta);
            let anchor2y = this.y + rBeats * sin(i*delta);

            if(i%2 === 0) {
                bezier(anchor1x, anchor1y, ctrl1x, ctrl1y, ctrl1x, ctrl1y, anchor2x, anchor2y);
                bezier(anchor1x, anchor1y, ctrl2x, ctrl2y, ctrl2x, ctrl2y, anchor2x, anchor2y);
            }
        }

        let echo = -TWO_PI/(nTatums*2);
        let rPTatums = rTatums/2;
        for(let i = 0; i < nTatums*2; i++){
            let anchor1x = this.x;
            let anchor1y = this.y;
            let ctrl1x = this.x + rPTatums * cos((i-1)*echo);
            let ctrl1y = this.y + rPTatums * sin((i-1)*echo);
            let ctrl2x = this.x + rPTatums * cos((i+1)*echo);
            let ctrl2y = this.y + rPTatums * sin((i+1)*echo);
            let anchor2x = this.x + rTatums * cos(i*echo);
            let anchor2y = this.y + rTatums * sin(i*echo);

            if(i%2 === 0) {
                bezier(anchor1x, anchor1y, ctrl1x, ctrl1y, ctrl1x, ctrl1y, anchor2x, anchor2y);
                bezier(anchor1x, anchor1y, ctrl2x, ctrl2y, ctrl2x, ctrl2y, anchor2x, anchor2y);
            }
        }

        let alpha = -TWO_PI/(nBars*2);
        let rPBars = rBars/2;
        for(let i = 0; i < nBars*2; i++){
            let anchor1x = this.x;
            let anchor1y = this.y;
            let ctrl1x = this.x + rPBars * cos((i-1)*alpha);
            let ctrl1y = this.y + rPBars * sin((i-1)*alpha);
            let ctrl2x = this.x + rPBars * cos((i+1)*alpha);
            let ctrl2y = this.y + rPBars * sin((i+1)*alpha);
            let anchor2x = this.x + rBars * cos(i*alpha);
            let anchor2y = this.y + rBars * sin(i*alpha);

            if(i%2 === 0) {
                bezier(anchor1x, anchor1y, ctrl1x, ctrl1y, ctrl1x, ctrl1y, anchor2x, anchor2y);
                bezier(anchor1x, anchor1y, ctrl2x, ctrl2y, ctrl2x, ctrl2y, anchor2x, anchor2y);
            }
        }

        if(this.mode === 1) {
            line(this.x, this.y, this.x, height);
        } else if(this.mode === 0){
            line(this.x, this.y, this.x, 0);
        }
    }

    balao() {
        fill(0);
        strokeWeight(2);
        stroke(this.c);
        beginShape();
            vertex(this.x, this.y - 210);
            vertex(this.x + 130, this.y - 210);
            vertex(this.x + 130, this.y - 50);
            vertex(this.x + 30, this.y - 50);
            vertex(this.x + 20, this.y - 25);
            vertex(this.x + 10, this.y - 50);
            vertex(this.x, this.y - 50);
        endShape(CLOSE);

        noStroke();
        fill(this.c);
        textStyle(BOLD);
        textSize(12);
        text("Added by " + split(this.owner, ' ')[0], this.x + 10, this.y - 190);
        textStyle(NORMAL);
        text("Energy: " + map(this.shakeX, 0, 5, 0, 100).toFixed(1) + "%", this.x + 10, this.y - 170);
        text("Danceability: ", this.x + 10, this.y - 150);
        text("Positivity: " + map(this.color, 0, 255, 0, 100).toFixed(1) + "%", this.x + 10, this.y - 130);
        text("Loudness: " + map(this.y, height, 0, 0, 100).toFixed(1) + "%", this.x + 10, this.y - 110);
        text("Speed: ", this.x + 10, this.y - 90);

        fill(0);
        stroke(this.c);
        rect(this.x + 10, this.y - 80, 110, 20);
        noStroke();
        fill(this.c);
        textSize(10);
        text("Add to Favorites ", this.x + 30, this.y - 65);
    }
}