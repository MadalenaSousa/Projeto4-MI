let userPlaylists, totalPlaylists;
let fromPlaylist = false;
let mountains = [];
let newMountain;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let recordList;


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
    }

    recordList = client.record.getList('all-playlists');

    for (let i = 0; i < totalPlaylists; i++) {
        document.querySelectorAll(".playlist")[i].addEventListener("click", function () { //sempre que clicar numa música
            record[i] = client.record.getRecord(userPlaylists[i].name); //cria um novo record no servidor
            record[i].set({ //define o novo record
                playlist: userPlaylists[i].name,
                px: random(150, windowWidth-550),
                py: random(150, windowHeight-100),
                color: color(255),
                largura: userPlaylists[i].tracks.total,
                resolution: map(userPlaylists[i].tracks.total, 0, 500, 13, 20), // número de "vértices"
                tam: map(userPlaylists[i].average_features.positivity, 0, 1.0, 10, 70),  //tamanho
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
            var lastPlaylist = recordList.getEntries()[recordList.getEntries().length-1];
            var currentRecord = client.record.getRecord(lastPlaylist);

            currentRecord.whenReady(function () {
                console.log(recordList.getEntries());
                addNewFlower(currentRecord.get('playlist'), currentRecord.get('px'), currentRecord.get('py'), currentRecord.get('largura'), currentRecord.get('color'),
                    currentRecord.get('resolution'), currentRecord.get('tam'), currentRecord.get('round'), currentRecord.get('nAmp'),
                    currentRecord.get('t'), currentRecord.get('tChange'), currentRecord.get('nInt'), currentRecord.get('nSeed'));
            });
        }
    }, true);
}

function addNewFlower(name, px, py, largura, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
    newMountain = new classMountain(name, px, py, largura, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed);
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

    constructor(name, px, py, largura, color, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
        this.name = name;
        this.px = px;
        this.py = py;
        this.largura = largura;
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
        if(dist(mouseX, mouseY, this.px, this.py) <= this.largura*5){
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

        beginShape();
        for (let b=1; b<=2; b++) {
            for (let a = -1; a <= 5; a += 5/ this.resolution) {
                this.nVal = map(noise(cos(a)*this.nInt+this.nSeed, sin(a)*this.nInt+this.nSeed, this.t), 0.0, 1.0, this.nAmp, 2.0);

                this.x = this.px + cos(a) * (this.tam + this.round) * this.nVal;
                this.y = this.py + sin(a) * this.tam * this.nVal;

                curveVertex(this.x, this.y);

            }
        }
        endShape(CLOSE);
    }

}