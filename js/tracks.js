let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;
let check = false;
let pY;
let musicOn = false;

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

let flowerSound = {};

const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

let flowerCanvas;
let w = window.innerWidth - window.innerWidth / 6;
let h = window.innerHeight;

function preload() {
    //playlistSongs = loadJSON('php/' + userid +'-playlist-songs-object.json');
    topSongs = loadJSON('php/' + userid + '-top-songs-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    flowerCanvas = createCanvas(w, h);
    flowerCanvas.id('flowerCanvas');

    client.login({username: user.name}, (success, data) => {
        if (success) {
            console.log("User logged in successfully");
            client.record.has(user.name, function (error, hasRecord) {
                console.log(error);
                if (hasRecord === false) {
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
        clearArray(clientsRecords);
        for (let i = 0; i < clients.length; i++) {
            console.log('Clients present on login: ' + clients);
            clientsRecords[i] = client.record.getRecord(clients[i]);
            clientsRecords[i].subscribe(function () {
                if((clientsRecords[i].get('name') !== undefined)) {
                    createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'));
                }
            });
        }
    });

    client.presence.subscribe((username, isLoggedIn) => {
        if (isLoggedIn) {
            console.log('A new client logged in');
            clearArray(clientsRecords);
            client.presence.getAll((error, clients) => {
                for (let i = 0; i < clients.length; i++) {
                    console.log('Updated clients list: ' + clients);
                    clientsRecords[i] = client.record.getRecord(clients[i]);
                    clientsRecords[i].subscribe(function () {
                        if((clientsRecords[i].get('name') !== undefined)) {
                            createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'));
                        }
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
    createPlaylistPopUp();
    backToHomepagePopUp();

    recordList = client.record.getList('all-songs');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if (recordList.isEmpty()) {
            clearArray(flowers);
            console.log("Não há músicas na lista");
        } else {
            clearArray(flowers);
            let recordsOnList = [];
            let soundIds = [];
            for (let i = 0; i < recordList.getEntries().length; i++) {
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    let speedX = 0;
                    if(recordsOnList[i].get('x') > max(allSpeed)) {
                        speedX = width - 200;
                    } else if(recordsOnList[i].get('x') < min(allSpeed)) {
                        speedX = 120;
                    } else {
                        speedX = map(recordsOnList[i].get('x'), min(allSpeed), max(allSpeed), 120, width - 200);
                    }
                    soundIds[i] = recordsOnList[i].get('id');
                    let soundF = getOrCreateSound(recordsOnList[i].get('id'), recordsOnList[i].get('url'));
                    addNewFlower(recordsOnList[i].get('id'), recordsOnList[i].get('song'), speedX, recordsOnList[i].get('y'), recordsOnList[i].get('y'), recordsOnList[i].get('raio'), recordsOnList[i].get('color'),
                        recordsOnList[i].get('energy'), recordsOnList[i].get('speed'), recordsOnList[i].get('danceability'), recordsOnList[i].get('url'), soundF, recordsOnList[i].get('artist'), recordsOnList[i].get('user'),
                        recordsOnList[i].get('tSections'), recordsOnList[i].get('dSections'), recordsOnList[i].get('lSections'),
                        recordsOnList[i].get('nBeats'), recordsOnList[i].get('rBeats'), recordsOnList[i].get('nSections'),
                        recordsOnList[i].get('mode'), recordsOnList[i].get('type'));
                });
            }
            clearSounds(soundIds);
        }
    });

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
        recordList.subscribe(function () {
            if (contains(recordList.getEntries(), songs[i].name)) {
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
                        id: songs[i].id,
                        x: getAudioFeatures(i).speed,
                        y: map(allLoudness[i], min(allLoudness), max(allLoudness), height - 80, 80),
                        raio: (songs[i].duration / 3),
                        color: map(allPositivity[i], min(allPositivity), max(allPositivity), 0, 255),
                        energy: getAudioFeatures(i).energy * 5,
                        speed: getAudioFeatures(i).speed / 5,
                        danceability: allDanceability[i],
                        artist: songs[i].artists,
                        url: songs[i].preview_url,
                        nSections: getAudioAnalysis(i).sections.total,
                        dSections: getAudioAnalysis(i).sections.durations,
                        lSections: getAudioAnalysis(i).sections.loudness,
                        tSections: getAudioAnalysis(i).sections.tempo,
                        nBeats: map(allBeatsTotal[i], min(allBeatsTotal), max(allBeatsTotal), 3, 5),
                        rBeats: map(allBeatsDuration[i], min(allBeatsDuration), max(allBeatsDuration), 30, 50),
                        mode: songs[i].mode,
                    });

                    recordList.addEntry(songs[i].name);

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

        resizeCanvas(windowHeight, windowHeight);
        saveCanvas('public-tracks-artboard.png');
        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);
    });
}

document.querySelector('.info').addEventListener('click', abrirPopupInfo);
document.querySelector('.fechar-info').addEventListener('click', fecharPopupInfo);

function getOrCreateSound(id, url) {
     if(!(id in flowerSound)) {
         flowerSound[id] = new Audio(url);
     }
    return flowerSound[id];
}

function clearSounds(ids) {
    let soundIds = Object.keys(flowerSound);
    for(let i = 0; i < soundIds.length; i++) {
        if(!(ids.includes(soundIds[i]))) {
            flowerSound[soundIds[i]].pause();
            delete flowerSound[soundIds[i]];
        }
    }
}

function abrirPopupInfo() {
    document.querySelector('.popup-info').style.display = "block";
    document.querySelector('.overlay').classList.remove('hide');
}

function fecharPopupInfo() {
    document.querySelector('.popup-info').style.display = "none";
    document.querySelector('.overlay').classList.add('hide');
}

function addNewFlower(id, name, x, y, pY, raio, color, energy, speed, danceability, url, sound, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode) {
    newFlower = new flowerSong(id, name, x, y, pY, raio, color, energy, speed, danceability, url, sound, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode);
    flowers.push(newFlower);
    console.log("LISTA DE FLORES ATUAL: " + flowers);
}

function removeFlower(id) {
    for(let i = 0; i < flowers.length; i++) {
        if(flowers[i].id === id) {
            flowers.splice(i, 1);
        }
    }
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

    for (let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('song') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }

    if (recordsToRemove.length === 0) {
        client.close();
    } else {
        for (let i = 0; i < recordsToRemove.length; i++) {
            recordList.removeEntry(recordsToRemove[i].get('song'));
            client.record.getRecord(recordsToRemove[i].get('song')).delete();
        }

        recordsToRemove[recordsToRemove.length - 1].on('delete', function () {
            client.close();
        });
    }

    client.on('connectionStateChanged', connectionState => {
        if (connectionState === 'CLOSED') {
            console.log('Connection state changed to: ' + connectionState + ', you will be redirected to homepage');
            document.location = './homepage.php';
        }
    });
}

function backToHomepagePopUp() {
    document.querySelector('.home-button').addEventListener('click', function () {
        document.querySelector('.logout-or-home').classList.remove('hide');
        document.querySelector('.overlay').classList.remove('hide');
    });

    document.querySelector('.close-home').addEventListener('click', function () {
        document.querySelector('.logout-or-home').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });

    document.querySelector('.back-artboard').addEventListener('click', function () {
        document.querySelector('.logout-or-home').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
    });

    document.querySelector('.keep-changes').addEventListener('click', function () {
        document.location = 'homepage.php';
    });

    document.querySelector('.delete-changes').addEventListener('click', function () {
        closeSongsRoomConnection();
    });
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
        let canvas = document.getElementById('flowerCanvas');
        let img = new Image(100, 100);
        img.src = canvas.toDataURL('image/jpeg', 0.01);
        img.classList.add('contorno');
        document.querySelector('.preview').appendChild(img);
        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);
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
        totalSongs.setAttribute('value', recordList.getEntries().length);

        document.querySelector('.create-playlist form').appendChild(totalSongs);

        for (let i = 0; i < recordList.getEntries().length; i++) {
            createPlaylistSongList(i);
        }

        resizeCanvas(windowHeight, windowHeight);
        let canvas = document.getElementById('flowerCanvas');
        let img = new Image(200, 200);
        img.src = canvas.toDataURL('image/jpeg', 0.01);
        img.style.border = '2px solid white';
        document.querySelector('.preview-create').appendChild(img);

        let playlistImg = document.createElement('input');
        playlistImg.setAttribute('type', 'hidden');
        playlistImg.setAttribute('name', 'playlistImg');
        playlistImg.setAttribute('value', canvas.toDataURL('image/jpeg'));

        document.querySelector('.create-playlist form').appendChild(playlistImg);

        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);

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

    for (let i = 0; i < arrayDivs.length; i++) {
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
    songLabel.innerText = recordList.getEntries()[index];

    let record = client.record.getRecord(recordList.getEntries()[index]);

    let songId = document.createElement('input');
    songId.setAttribute('type', 'hidden');
    songId.setAttribute('name', 'songId' + index);
    songId.setAttribute('value', record.get('id'));

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

    if(flowers.length > 0) {
        for(let i = 0; i < flowers.length; i++) {
            flowers[i].display();
        }

        for (let i = 0; i < flowers.length; i++) {
            if (dist(mouseX, mouseY, flowers[i].x, flowers[i].y) <= 120) {
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
    random;
    musicOn;
    sound;
    randflower;
    curves;
    theta;

    constructor(id, name, x, y, pY, raio, color, energy, speed, danceability, url, sound, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color = color;
        this.shake = energy;
        this.speed = speed;
        this.danceability = danceability;
        this.artist = artist;
        this.owner = owner;
        this.mode = mode;
        this.nBeats = nBeats;
        this.rBeats = rBeats;
        this.numberSections = numberSections;
        this.arraySectionLoudness = arraySectionLoudness;
        this.arraySectionTempo = arraySectionTempo;
        this.arraySectionDuration = arraySectionDuration;
        this.pY = pY;
        this.theta = TWO_PI / (nBeats * 2);

        this.curves = [];
        this.randflower = new randFlower(arraySectionTempo, arraySectionDuration, arraySectionLoudness, this.curves, x, y, this.numberSections, mode);

        this.url = url;
        this.sound = sound;
        console.log(sound.paused);
        this.musicOn = !sound.paused;
    }

    display() {
        this.c = color(255, 255, 255 - this.color);
        stroke(this.c);
        this.flor(this.x, this.y, this.nBeats, this.rBeats, this.mode, this.theta);

        if (dist(mouseX, mouseY, this.x, this.y) <= 120) {
            this.random = random(-this.shake, this.shake);
            this.botaoPlay(this.x, this.y, this.musicOn);
        } else {
            this.random = 0;
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

    }

    playSong() {
        if (dist(mouseX, mouseY, this.x, this.y) <= 20) {
            this.musicOn = !this.musicOn;
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
            this.curves[c].display(this.random, this.random);
        }

        //BEATS
        for (let i = 0; i < nBeats * 2; i++) {
            let xB = x + rBeats / 1.5 * cos(i * theta);
            let yB = y + rBeats / 1.5 * sin(i * theta);
            line(x, y, xB + this.random, yB + this.random);
            fill(255);
            ellipse(xB + this.random, yB + this.random, 5, 5);
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
            text("Energy: " + map(this.shake, 0, 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y - 170);
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
            text("Energy: " + map(this.shake, 0, 5, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 100);
            text("Danceability: " + map(this.danceability, 0, 1, 0, 100).toFixed(1) + "%", this.x + 30, this.y + 120);
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

function avg(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum = sum + array[i];
    }

    return sum / array.length;
}