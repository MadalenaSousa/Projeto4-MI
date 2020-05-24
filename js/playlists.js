let userPlaylists, totalPlaylists;
let mountains = [];
let newMountain;
let remove;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

let trackstotal=[];
let speedX=[];
let loudnessY=[];
let positivityCor=[];

var previewShare = document.createElement("div");
var cruz = document.createElement("div");
var botaoDownload = document.createElement("div");



function preload() {
    userPlaylists = loadJSON('php/' + userid + '-playlist-object.json');
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

    totalPlaylists = Object.keys(userPlaylists).length;

    createUserDiv(user.name, user.profile_pic);
    createPlaylistDiv();
    logoutPopUp();
    sharePopUp();
    backToHomepagePopUp();

    for(let i = 0; i < totalPlaylists; i++) {
        trackstotal.push(userPlaylists[i].tracks.total);
        speedX.push(userPlaylists[i].average_features.speed);
        loudnessY.push(userPlaylists[i].average_features.loudness);
        positivityCor.push(userPlaylists[i].average_features.positivity);
    }

    recordList = client.record.getList('all-playlists');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if(recordList.isEmpty()) {
            clearMountains();
            console.log("Não há músicas na lista");
        } else {
            clearMountains();
            let recordsOnList = [];
            for(let i = 0; i < recordList.getEntries().length; i++){
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    addNewMountain (recordsOnList[i].get('playlist'), recordsOnList[i].get('playlistId'),recordsOnList[i].get('px'), recordsOnList[i].get('py'), recordsOnList[i].get('numtracks'), recordsOnList[i].get('color'),
                        recordsOnList[i].get('resolution'), recordsOnList[i].get('tam'), recordsOnList[i].get('round'), recordsOnList[i].get('nAmp'),
                        recordsOnList[i].get('t'), recordsOnList[i].get('tChange'), recordsOnList[i].get('nInt'), recordsOnList[i].get('nSeed'), recordsOnList[i].get('user'));
                });
            }
        }
    });

    for (let i = 0; i < totalPlaylists; i++) {
        recordList.subscribe(function () {
            if(contains(recordList.getEntries(), userPlaylists[i].name)){
                remove[i].classList.remove('hide');
            } else {
                remove[i].classList.add('hide');
            }
        });

        document.querySelectorAll(".playlist")[i].addEventListener("click", function () {
            console.log("Clicou na música" + userPlaylists[i].name);
            client.record.has(userPlaylists[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + userPlaylists[i].name + ", can create it");
                    record[i] = client.record.getRecord(userPlaylists[i].name); //cria um novo record no servidor
                    record[i].set({ //define o novo record
                        user: user.name,
                        playlist: userPlaylists[i].name,
                        playlistId: userPlaylists[i].id,
                        px: map(userPlaylists[i].average_features.speed, min(speedX), max(speedX), 110, width - 410),
                        py: map(userPlaylists[i].average_features.loudness, min(loudnessY), max(loudnessY), 140, height - 110),
                        color: map(userPlaylists[i].average_features.positivity, min(positivityCor), max(positivityCor), 190, 0),
                        numtracks: userPlaylists[i].tracks.total,
                        resolution: map(userPlaylists[i].average_features.positivity, 0, 1.0, 13, 20),// número de "vértices"
                        tam: map(userPlaylists[i].tracks.total, min(trackstotal), max(trackstotal), 20, 80), //tamanho
                        round: map(userPlaylists[i].average_features.energy, 0.0, 1.0, 30, 0), //quanto maior o valor, mais espalmada
                        nAmp: map(userPlaylists[i].average_features.loudness, -60, 0, 0.3, 1), // valor=1 -> redonda
                        t: 0,
                        tChange: map(userPlaylists[i].average_features.danceability, 0.0, 1.0, 0.01, 0.06), // dança do objeto
                        nInt: 10, //intensidade
                        nSeed: 10
                    });

                    recordList.addEntry(userPlaylists[i].name);

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + userPlaylists[i].name + ", already exists, cannot create it");
                }
            });

        });

        remove[i].addEventListener("click", function () {
            client.record.has(userPlaylists[i].name, function (error, hasRecord) {
                if (hasRecord) {
                    console.log('Has record with name: ' + userPlaylists[i].name + ', can delete it');

                    recordList.removeEntry(userPlaylists[i].name);
                    client.record.getRecord(userPlaylists[i].name).delete();

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Doesnt have record with name: ' + userPlaylists[i].name + ', cannot delete it');
                }
            });
        });

    }

    document.querySelector('.confirm-logout').addEventListener('click', closePlaylistRoomConnection);

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');

        resizeCanvas(windowHeight, windowHeight);
        saveCanvas( 'public-playlists-artboard.png');
        resizeCanvas(windowWidth - windowWidth/6, windowHeight);
    });

}


document.querySelector('.info').addEventListener('click', abrirPopupInfo);
document.querySelector('.fechar-info').addEventListener('click', fecharPopupInfo);


function abrirPopupInfo(){
    document.querySelector('.popup-info').style.display = "block";
}

function fecharPopupInfo(){
    document.querySelector('.popup-info').style.display = "none";
}



function addNewMountain(name, id, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed, owner) {
    newMountain = new classMountain(name, id, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed, owner);
    mountains.push(newMountain);
    console.log(mountains);
}

function clearMountains() {
    mountains.splice(0, mountains.length);
}

function contains(array, nome) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === nome) {
            return true;
        }
    }
    return false;
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
        closePlaylistRoomConnection();
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

function cleanCreatePlaylistPreview() {
    let arrayDivs = document.querySelectorAll('.preview img');

    for(let i = 0; i < arrayDivs.length; i++) {
        arrayDivs[i].remove();
    }
}

function createPlaylistDiv() {
    for(let i = 0; i < totalPlaylists; i++) {
        let playlist = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('playlist');

        nome.innerText =userPlaylists[i].name;

        nomeDiv.appendChild(nome);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.classList.add("removePlaylists");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        playlist.classList.add('unit');

        playlist.appendChild(nomeDiv);
        playlist.appendChild(remove);
        document.querySelector(".list-playlists").appendChild(playlist);
    }
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

function closePlaylistRoomConnection() {
    let allRecords = [];
    let recordsToRemove = [];

    for(let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('playlist') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }

    if(recordsToRemove.length === 0) {
        client.close();
    } else {
        for(let i = 0; i < recordsToRemove.length; i++) {
            recordList.removeEntry(recordsToRemove[i].get('playlist'));
            client.record.getRecord(recordsToRemove[i].get('playlist')).delete();
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

function draw() {

    if (cruz.style.display === "block" || previewShare.style.display === "block") {
        document.querySelector(".cruz").addEventListener('click', function () {
            document.querySelector('.cruz').style.display = "none";
            document.querySelector('.PreviewShare').style.display = "none";
            document.querySelector('.overlay').classList.add('hide')
        });
    }

    background(0);
    if(mountains.length > 0) {
        for(let i = 0; i < mountains.length; i++) {
            mountains[i].display();
        }

        for(let i = 0; i < mountains.length; i++) {
            if(dist(mouseX, mouseY, mountains[i].px, mountains[i].py) <= mountains[i].tam * 3) {
                mountains[i].balao();
            }
        }
    }
}


class classMountain {
    c;
    nVal;
    x;
    y;
    valor;

    constructor(name, id, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed, owner) {
        this.name = name;
        this.id = id;
        this.px = px;
        this.py = py;
        this.numtracks = numtracks;
        this.color  = color;
        this.resolution  = resolution;
        this.tam  = tam;
        this.round  = round;
        this.nAmp  = nAmp;
        this.t  = t;
        this.tChange  = tChange;
        this.nInt=nInt;
        this.nSeed=nSeed;
        this.owner=owner;
    }

    display() {
        if (dist(mouseX, mouseY, this.px, this.py) <= this.tam * 2) {
            this.t += this.tChange;
        }
        this.c = color(this.color, 210, 255);
        stroke(this.c);

        this.montanha();

        if ((dist(mouseX, mouseY, this.px, this.py) <= this.tam * 2)) {
            if(this.py <=240) this.valor=40;
            else if (this.py > 240) this.valor=0;
            //this.balao();
        }
    }

    montanha(){

            if (this.numtracks <= 30) {
                this.tam = map(this.numtracks, 0, 30, 10, 30);
            }
            else if((this.numtracks > 30) && (this.numtracks <= 60)) {
                this.tam = map(this.numtracks, 31, 60, 30, 50);
            }
            else if((this.numtracks > 60) && (this.numtracks <= 90)) {
                this.tam = map(this.numtracks, 61, 90, 50, 60);
            }
            else if((this.numtracks > 90) && (this.numtracks <= 120)) {
                this.tam = map(this.numtracks, 91, 120, 60, 70);
            }
            else if((this.numtracks > 120) && (this.numtracks <= 200)) {
                this.tam = map(this.numtracks, 121, 200, 70, 80);
            }
            else if((this.numtracks > 200) && (this.numtracks <= 400)) {
                this.tam = map(this.numtracks, 201, 400, 80, 90);
            }
            else if((this.numtracks > 400) && (this.numtracks <= 600)) {
                this.tam = map(this.numtracks, 401, 600, 90, 100);
            }
            else if(this.numtracks > 600) this.tam = 105;

            //fill(0);
        stroke(this.c);
        strokeWeight(2);
        noFill();
            for (let b = 1; b <= (this.tam) / 10; b++) {
                beginShape();
                for (let a = -1; a <= 5; a += 5 / this.resolution) {
                    this.nVal = map(noise(cos(a) * this.nInt + this.nSeed, sin(a) * this.nInt + this.nSeed, this.t), 0.0, 1.0, this.nAmp, 2.0);

                    this.x = this.px + (cos(a) * (this.tam + this.round) * this.nVal) / b;
                    this.y = this.py + (sin(a) * (this.tam + this.round) * this.nVal) / b;

                    curveVertex(this.x, this.y);
                }
                endShape(CLOSE);
            }
        //nome da playlist
        textStyle(BOLD);
        noStroke();
        fill(this.c);
        textSize(12);
        text(this.name, this.px, this.py);
    }

    balao(){
        //caixa de informação
        fill(0);
        strokeWeight(2);
        stroke(this.c);
        beginShape();
        vertex(this.px, this.py - 230 + (this.valor*11.5));
        vertex(this.px + 130, this.py - 230 + (this.valor*11.5));
        vertex(this.px + 130, this.py - 50 + (this.valor*2.5));
        vertex(this.px + 30, this.py - 50 + (this.valor*2.5));
        vertex(this.px + 20, this.py - 25 + (this.valor*1.2));
        vertex(this.px + 10, this.py - 50 + (this.valor*2.5));
        vertex(this.px, this.py - 50 + (this.valor*2.5));
        endShape(CLOSE);

        noStroke();
        fill(this.c);
        textStyle(BOLD);
        textSize(12);
        text("Added by " + split(this.owner, ' ')[0], this.px + 10, this.py - 210 + (this.valor*7.7));
        textStyle(NORMAL);
        text("Energy: " + map(this.round, 30,0, 0.0, 1.0).toFixed(1)*100 + "%", this.px + 10, this.py - 190 + (this.valor*7.7));
        text("Danceability: " + map(this.tChange, 0.01, 0.06, 0.0, 1.0).toFixed(1)*100 + "%", this.px + 10, this.py - 170 + (this.valor*7.7));
        text("Positivity: " + map(this.resolution, 13, 20, 0, 1.0).toFixed(1)*100 + "%", this.px + 10, this.py - 150 + (this.valor*7.7));
        text("Loudness: " + map(this.nAmp, 0.3, 1, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 130 + (this.valor*7.7));
        text("Speed: " + map(this.resolution, 13, 20, 0, 1.0).toFixed(1)*100 + "%", this.px + 10, this.py - 110 + (this.valor*7.7));
        text("Total songs: " + this.numtracks, this.px + 10, this.py - 90 + (this.valor*7.7));

        if((mouseX > this.px + 10) && (mouseX < this.px + 110) && (mouseY > this.py - 80 + (this.valor*3.5)) && (mouseY < this.py - 60)+ (this.valor*4)) {
            fill(this.c);
            stroke(this.c);
            rect(this.px + 10, this.py - 80 + (this.valor*3.5), 110, 20);
            noStroke();
            fill(0);
            textSize(10);
            textStyle(BOLD);
            text("Save Playlist", this.px + 30, this.py - 65 + (this.valor*3.5));

            if(mouseIsPressed) {
                window.location = 'php/savePlaylist.php?id=' + this.id;
            }

        } else {
            fill(0);
            stroke(this.c);
            rect(this.px + 10, this.py - 80 + (this.valor*3.5), 110, 20);
            noStroke();
            fill(this.c);
            textSize(10);
            text("Save Playlist", this.px + 30, this.py - 65 + (this.valor*3.5));
        }
    }
}