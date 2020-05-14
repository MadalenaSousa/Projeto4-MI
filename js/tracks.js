let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;
let check = false;

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
    createPlaylistPopUp();

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
                        recordsOnList[i].get('tSections'), recordsOnList[i].get('dSections'), recordsOnList[i].get('lSections'),
                        recordsOnList[i].get('nBeats'), recordsOnList[i].get('rBeats'),recordsOnList[i].get('nSections'),
                        recordsOnList[i].get('mode'), recordsOnList[i].get('type'));
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
                        y: map(allLoudness[i], min(allLoudness), max(allLoudness), height - 80, 80),
                        raio: (songs[i].duration / 3),
                        color: map(getAudioFeatures(i).positivity, 0, 1, 0, 255),
                        energy: getAudioFeatures(i).energy * 5,
                        artist: songs[i].artists,
                        url: songs[i].preview_url,
                        nSections: getAudioAnalysis(i).sections.total,
                        dSections: getAudioAnalysis(i).sections.durations,
                        lSections: getAudioAnalysis(i).sections.loudness,
                        tSections: getAudioAnalysis(i).sections.tempo,
                        nBeats: map(allBeatsTotal[i], min(allBeatsTotal), max(allBeatsTotal), 3, 5),
                        rBeats: map(allBeatsDuration[i], min(allBeatsDuration), max(allBeatsDuration), 30, 50),
                        mode: songs[i].mode,
                        type: songs[i].type
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

function addNewFlower(name, x, y, raio, color, energy, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode, type) {
    newFlower = new flowerSong(name, x, y, raio, color, energy, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections, mode, type);
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

function createPlaylistPopUp() {
    document.querySelector(".create-button").addEventListener('click', function () {
        document.querySelector('.create-playlist').classList.toggle('hide');
    });

    document.querySelector(".close-create").addEventListener('click', function () {
        document.querySelector('.create-playlist').classList.add('hide');
    });
}

function createPlaylistSongList(index) {
    let songDiv = document.createElement('div');

    songDiv.innerText = songs[index].name;

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
    randflower;
    curves;

    constructor(name, x, y, raio, color, energy, url, artist, owner, arraySectionTempo, arraySectionDuration, arraySectionLoudness, nBeats, rBeats, numberSections,  mode, type) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color  = color;
        this.shakeX = energy;
        this.shakeY = energy;
        this.artist = artist;
        this.owner = owner;
        this.mode = mode;
        this.type = type;
        this.nBeats = nBeats;
        this.rBeats = rBeats;
        this.numberSections = numberSections;
        this.arraySectionDuration = arraySectionDuration;

        this.curves = [];
        this.randflower = new randFlower(arraySectionTempo, arraySectionDuration, arraySectionLoudness, this.curves, x, y, this.numberSections, mode, type);

        this.sound = new Audio(url);
        this.musicOn = false;
    }

    display() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.c = color(255, 255, 255 - this.color);
            this.randomX = random(-this.shakeX, this.shakeX);
            this.randomY = random(-this.shakeY, this.shakeY);
            console.log("entrou");
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
        this.flor(this.x, this.y, this.nBeats, this.rBeats, this.mode, this.type);

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

    flor(x, y, nBeats, rBeats, mode, type) {
        strokeWeight(2);
        fill(0);

        let n = 1;
        let d = 1;
        let k = n / d;

        let alpha = 0;
        let theta = 0;


        //LINHA + ORIENTAÇÃO DAS FLORES
        if(mode === 1) {
            line(this.x, this.y, this.x, height);
            alpha = -PI/(nBeats*2);
            theta = -TWO_PI/(nBeats*2);
        } else if(mode === 0){
            line(this.x, this.y, this.x, 0);
            alpha = PI/(nBeats*2);
            theta = TWO_PI/(nBeats*2);
        }


        //SMALL DAISY
        if(type === 0 || type === 1) { // DO + DO#

            //SECTIONS
            n = this.numberSections;
            d = 1;
            k = n / d;

            beginShape();
            for (let a = 0; a < TWO_PI * d; a += 0.02) {
                let r = map(avg(this.arraySectionDuration), min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * cos(k * a);
                let xB = x + r * cos(a);
                let yB = y + r * sin(a);
                vertex(xB + this.randomX/2, yB + this.randomY/2);
            }
            endShape(CLOSE);

            //BEATS
            for(let i = 0; i < nBeats*2; i++) {
                let xB = x  + rBeats/2 * cos(i*theta);
                let yB = y  + rBeats/2 * sin(i*theta);
                line(x, y, xB + this.randomX, yB + this.randomY);
                fill(255);
                ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
            }


        //BIG DAISY
        } else if(type === 2 || type === 3) { // RE + RE#

            //SECTIONS
            n = this.numberSections + 2;
            d = this.numberSections;
            k = n / d;

            beginShape();
            for (let a = 0; a < TWO_PI * d; a += 0.02) {
                let r = map(avg(this.arraySectionDuration), min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * cos(k * a);
                let xB = x + r * cos(a);
                let yB = y + r * sin(a);
                vertex(xB + this.randomX/2, yB + this.randomY/2);
            }
            endShape(CLOSE);

            //BEATS
            for(let i = 0; i < nBeats*2; i++) {
                let xB = x  + rBeats/2 * cos(i*theta);
                let yB = y  + rBeats/2 * sin(i*theta);
                line(x, y, xB + this.randomX, yB + this.randomY);
                fill(255);
                ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
            }


        //DENDILION WITH SEED
        } else if(type === 4) { // MI

            //SECTIONS
            for(let i = 0; i < this.numberSections; i++) {
                let xS = x  + map(this.arraySectionDuration[i], min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * cos(i*alpha);
                let yS = y  + map(this.arraySectionDuration[i], min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * sin(i*alpha);
                line(x, y, xS + this.randomX, yS + this.randomY);

                //BEATS
                for(let z = 0; z < nBeats*2; z++) {
                    let xB = xS  + (rBeats/2) * cos(z*theta);
                    let yB = yS  + (rBeats/2) * sin(z*theta);
                    line(xS, yS, xB + this.randomX, yB + this.randomY);
                    fill(255);
                    ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
                }
            }


        //DENDILION WITHOUT SEED
        } else if(type === 5 || type === 6) { //FA + FA#

            //SECTIONS
            for(let i = 0; i < this.numberSections; i++) {
                let xS = x  + map(this.arraySectionDuration[i], min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * cos(i*alpha);
                let yS = y  + map(this.arraySectionDuration[i], min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * sin(i*alpha);
                line(x, y, xS + this.randomX, yS + this.randomY);

                //BEATS
                for(let z = 0; z < nBeats*2; z++) {
                    let xB = xS  + (rBeats/3) * cos(z*theta);
                    let yB = yS  + (rBeats/3) * sin(z*theta);
                    line(xS, yS, xB + this.randomX, yB + this.randomY);
                }
            }


        //ROSE
        } else if(type === 7 || type === 8) { //SOL + SOL#

            //SECTIONS
            n = 1;
            d = this.numberSections;
            k = n / d;

            beginShape();
            for (let a = 0; a < TWO_PI * d; a += 0.02) {
                let r = map(avg(this.arraySectionDuration), min(this.arraySectionDuration), max(this.arraySectionDuration), 60, 100) * cos(k * a);
                let xB = x + r * cos(a);
                let yB = y + r * sin(a);
                vertex(xB + this.randomX/2, yB + this.randomY/2);
            }
            endShape(CLOSE);

            //BEATS
            for(let i = 0; i < nBeats*2; i++) {
                let xB = x  + rBeats/2 * cos(i*theta);
                let yB = y  + rBeats/2 * sin(i*theta);
                line(x, y, xB + this.randomX, yB + this.randomY);
                fill(255);
                ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
            }


        //RANDOM PETALS (HALF OPEN)
        } else if(type === 9 || type === 10) { //LA + LA#

            //SECTIONS
            for (let c = 0; c < this.curves.length; c++) {
                this.curves[c].display(this.randomX, this.randomY);
            }

            //BEATS
            for(let i = 0; i < nBeats*2; i++) {
                let xB = x  + rBeats * cos(i*alpha);
                let yB = y  + rBeats * sin(i*alpha);
                line(x, y, xB + this.randomX, yB + this.randomY);
                fill(255);
                ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
            }

        //RANDOM PETALS (FULLY OPEN)
        } else { //SI + ERROS

            //SECTIONS
            for (let c = 0; c < this.curves.length; c++) {
                this.curves[c].display(this.randomX, this.randomY);
            }

            //BEATS
            for(let i = 0; i < nBeats*2; i++) {
                let xB = x  + rBeats * cos(i*theta);
                let yB = y  + rBeats * sin(i*theta);
                line(x, y, xB + this.randomX, yB + this.randomY);
                fill(255);
                ellipse(xB + this.randomX, yB + this.randomY, 5, 5);
            }
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

class randFlower {

    constructor(arraySectionTempo, arraySectionDuration, arraySectionLoudness, curves, x, y, linenum, mode, type) {
        this.x = x;
        this.y = y;
        this.linenum = linenum; //numero de sections
        this.mode = mode;
        for (let i = 0; i < this.linenum; i++) {
            if(type === 9 || type === 10) {
                if(this.mode === 0) {
                    this.theta = map(arraySectionTempo[i], min(arraySectionTempo), max(arraySectionTempo), -PI, -TWO_PI); //maior/menor //tempo (speed) da section
                } else {
                    this.theta = map(arraySectionTempo[i], min(arraySectionTempo), max(arraySectionTempo), PI, TWO_PI);
                }
            } else {
                if(this.mode === 0) {
                    this.theta = map(arraySectionTempo[i], min(arraySectionTempo), max(arraySectionTempo), 0, TWO_PI); //maior/menor //tempo (speed) da section
                } else {
                    this.theta = map(arraySectionTempo[i], min(arraySectionTempo), max(arraySectionTempo), TWO_PI, 0);
                }
            }
            this.d = map(arraySectionLoudness[i], min(arraySectionLoudness), max(arraySectionLoudness), 80, 120); //loudness da section
            this.hy = sin(this.theta);
            this.hx = cos(this.theta);
            this.ex = this.d * this.hx + this.x;
            this.ey = this.d * this.hy + this.y;

            for (let z = 0; z < 2; z++) {
                if(z === 0) {
                    this.bow = map(arraySectionDuration[i], min(arraySectionDuration), max(arraySectionDuration), 20, 50); //duração da section
                } else if(z === 1) {
                    this.bow = -map(arraySectionDuration[i], min(arraySectionDuration), max(arraySectionDuration), 20, 50);
                }
                curves.push(new Curve(this.x, this.y, this.ex, this.ey, this.bow));
            }
        }
    }

    display(){
        stroke(255);
        strokeWeight(2);

        line(this.x, this.y, this.x, height);
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
    for(let i = 0; i < array.length; i++) {
        sum = sum + array[i];
    }

    return sum/array.length;
}