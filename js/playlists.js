let userPlaylists, totalPlaylists;
let mountains = [];
let newMountain;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;

let trackstotal=[];


function preload() {
    userPlaylists = loadJSON('php/playlist-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);

    client.login();
    totalPlaylists=Object.keys(userPlaylists).length;

    for(let i = 0; i < totalPlaylists; i++) {
        let list = document.createElement("div");
        list.innerText = userPlaylists[i].name;
        list.classList.add("playlist");
        document.querySelector(".list-playlists").appendChild(list);
        trackstotal.push(userPlaylists[i].tracks.total);
    }

    recordList = client.record.getList('all-playlists');

    for (let i = 0; i < totalPlaylists; i++) {
        document.querySelectorAll(".playlist")[i].addEventListener("click", function () { //sempre que clicar numa música
            record[i] = client.record.getRecord(userPlaylists[i].name); //cria um novo record no servidor
            record[i].set({ //define o novo record
                playlist: userPlaylists[i].name,
                px: random(100, windowWidth-400),
                py: random(100, windowHeight-100),
                color: color(255),
                numtracks: userPlaylists[i].tracks.total,
                resolution: map(userPlaylists[i].average_features.positivity, 0, 1.0, 13, 20),// número de "vértices"
                tam: map(userPlaylists[i].tracks.total, min(trackstotal), max(trackstotal), 0, 60), //tamanho
                round: map(userPlaylists[i].average_features.energy, 0.0, 1.0, 30, 0), //quanto maior o valor, mais espalmada
                nAmp: map(userPlaylists[i].average_features.loudness, -60, 0, 0.3, 1), // valor=1 -> redonda
                t: 0,
                tChange: map(userPlaylists[i].average_features.danceability, 0.0, 1.0, 0.01, 0.06), // dança do objeto
                nInt: 10, //intensidade
                nSeed: 10
            });

            recordList.addEntry(userPlaylists[i].name);
        });
    }

    recordList.subscribe(function () {
        if(recordList.isEmpty() === false) {
            let currentRecord=[];

            for(let i = 0; i < recordList.getEntries().length; i++) {
                currentRecord[i] = client.record.getRecord(recordList.getEntries()[i]);
                currentRecord[i].whenReady(function () {

                    addNewFlower(currentRecord.get('playlist'), currentRecord.get('px'), currentRecord.get('py'), currentRecord.get('numtracks'), currentRecord.get('color'),
                        currentRecord.get('resolution'), currentRecord.get('tam'), currentRecord.get('round'), currentRecord.get('nAmp'),
                        currentRecord.get('t'), currentRecord.get('tChange'), currentRecord.get('nInt'), currentRecord.get('nSeed'));
                });
            }
        }
    }, true);
}

function addNewFlower(name, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
    newMountain = new classMountain(name, px, py, numtracks, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed);
    mountains.push(newMountain);
    console.log(mountains);
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
        if(dist(mouseX, mouseY, this.px, this.py) <= 15){
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
        strokeWeight(1.5);
        noFill();


        if((this.numtracks)>=20) this.valor=(this.numtracks)/10;
        else this.valor=2;
        for (let b=1; b<=this.valor; b++) {
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