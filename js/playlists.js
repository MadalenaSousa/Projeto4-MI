let userPlaylists, totalPlaylists;
let mountains = [];
let newMountain;
let remove;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;

let trackstotal=[];


function preload() {
    userPlaylists = loadJSON('php/playlist-object.json');
    user = loadJSON('php/user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);

    client.login();
    totalPlaylists = Object.keys(userPlaylists).length;

    createUserDiv();
    createPlaylistDiv();

    for(let i = 0; i < totalPlaylists; i++) {
        trackstotal.push(userPlaylists[i].tracks.total);
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
                    addNewMountain (recordsOnList[i].get('playlist'), recordsOnList[i].get('px'), recordsOnList[i].get('py'), recordsOnList[i].get('numtracks'), recordsOnList[i].get('color'),
                        recordsOnList[i].get('resolution'), recordsOnList[i].get('tam'), recordsOnList[i].get('round'), recordsOnList[i].get('nAmp'),
                        recordsOnList[i].get('t'), recordsOnList[i].get('tChange'), recordsOnList[i].get('nInt'), recordsOnList[i].get('nSeed'));
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
                        playlist: userPlaylists[i].name,
                        px: random(100, windowWidth-400),
                        py: random(100, windowHeight-100),
                        color: color(255),
                        numtracks: userPlaylists[i].tracks.total,
                        resolution: map(userPlaylists[i].average_features.positivity, 0, 1.0, 13, 20),// número de "vértices"
                        tam: map(userPlaylists[i].tracks.total, min(trackstotal), max(trackstotal), 10, 60), //tamanho
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

}

function addNewMountain(name, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
    newMountain = new classMountain(name, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed);
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
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        playlist.classList.add('unit');

        playlist.appendChild(nomeDiv);
        playlist.appendChild(remove);
        document.querySelector(".list-playlists").appendChild(playlist);
    }
}

function createUserDiv() {
    let userDiv = document.createElement('div');
    let person = document.createElement('div');
    let img = document.createElement('img');

    img.setAttribute('src', user.profile_pic);
    img.setAttribute('width', '30px');
    img.setAttribute('height', '30px');

    person.innerText = user.name;
    person.classList.add('username');

    userDiv.classList.add('user');
    userDiv.appendChild(img);
    userDiv.appendChild(person);

    document.querySelector(".list-people").appendChild(userDiv);
}

function draw() {
    background(0);
    if(mountains.length > 0) {
        for(let i = 0; i < mountains.length; i++) {
            mountains[i].display();
        }
    }
}


class classMountain {
    c;
    nVal;
    x;
    y;
    valor;

    constructor(name, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
        this.name = name;
        this.px = px;
        this.py = py;
        this.numtracks = numtracks;
        this.resolution  = resolution;
        this.tam  = tam;
        this.round  = round;
        this.nAmp  = nAmp;
        this.t  = t;
        this.tChange  = tChange;
        this.nInt=nInt;
        this.nSeed=nSeed;
    }

    display() {
        if(dist(mouseX, mouseY, this.px, this.py) <= this.tam*2){
            this.c = color(0,200,255);
            this.t += this.tChange;
            //nome da playlist
            noStroke();
            fill(this.c);
            textSize(12);
            text(this.name, this.px, this.py);

        } else {
            this.c = color(255);
        }

        //desenho
        stroke(this.c);
        strokeWeight(1);
        noFill();

        for (let b=1; b<=(this.tam)/10; b++) {
            beginShape();
            for (let a = -1; a <= 5; a += 5/ this.resolution) {
                this.nVal = map(noise(cos(a)*this.nInt+this.nSeed, sin(a)*this.nInt+this.nSeed, this.t), 0.0, 1.0, this.nAmp, 2.0);

                this.x = this.px + (cos(a) * (this.tam + this.round) * this.nVal)/b;
                this.y = this.py + (sin(a) * (this.tam + this.round) * this.nVal)/b;

                curveVertex(this.x, this.y);
            }
            endShape(CLOSE);
        }
    }
}