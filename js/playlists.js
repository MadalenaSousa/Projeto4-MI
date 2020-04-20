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
        document.querySelectorAll(".playlist")[i].addEventListener("click", function () { //sempre que clico numa música
            record[i] = client.record.getRecord(userPlaylists[i].name); //crio um novo record no servidor
            record[i].set({ //defino o novo record
                playlist: userPlaylists[i].name,
                px: random(0, windowWidth-300),
                py: random(0, windowHeight-300),
                color: color(255),
                largura: userPlaylists[i].tracks.total,
                resolution: 13, // número de "vértices"
                rad: 90,  //tamanho
                round: random(0, 100), //valor q ainda nao percebi o q afeta bem
                nInt: 460, // tmb n sei q faz
                nAmp: 0.4, // valor=1 -> redonda
                nSeed: random(0, 60), // tambem n sei q afeta
                t: 0,
                tChange: 0.01
                //tChange: getAudioFeatures(i).energy
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
                    currentRecord.get('resolution'), currentRecord.get('rad'), currentRecord.get('round'), currentRecord.get('nInt'), currentRecord.get('nAmp'),
                    currentRecord.get('nSeed'), currentRecord.get('t'), currentRecord.get('tChange'));
            });
        }
    }, true);
}

function addNewFlower(name, px, py, largura, color, resolution, rad, round, nInt, nAmp, nSeed, t, tChange) {
    newMountain = new classMountain(name, px, py, largura, color, resolution, rad, round, nInt, nAmp, nSeed, t, tChange);
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

    constructor(name, px, py, largura, color, resolution, rad, round, nInt, nAmp, nSeed, t, tChange) {
        this.name = name;
        this.px = px;
        this.py = py;
        this.largura = largura;
        this.resolution  = resolution;
        this.rad  = rad;
        this.round  = round;
        this.nInt  = nInt;
        this.nAmp  = nAmp;
        this.nSeed  = nSeed;
        this.t  = t;
        this.tChange  = tChange;

    }

    display() {
        if(dist(mouseX, mouseY, this.px, this.py) <= this.largura*5){
            this.c = color(0,200,255);
            this.t += this.tChange;

        } else {
            this.c = color(255);
        }

        //desenho
        stroke(this.c);
        strokeWeight(1.5);
        noFill();

        beginShape();
        for (let b=1; b<=2; b++) {
            for (let a = -1; a <= TWO_PI; a += TWO_PI / this.resolution) {
                this.nVal = map(noise(cos(a) * this.nInt + this.nSeed, sin(a) * this.nInt + this.nSeed, this.t), 0.0, 1.0, this.nAmp, 1.0);

                this.x = this.px + cos(a) * (this.rad + this.round) * this.nVal;
                this.y = this.py + sin(a) * this.rad * this.nVal;

                curveVertex(this.x, this.y);

            }
        }
        endShape(CLOSE);


        //nome da playlist
        noStroke();
        fill(this.c);
        textSize(12);
        text(this.name, this.px, this.py);
    }

}