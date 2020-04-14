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
                x: random(0, windowWidth),
                y: random(0, windowHeight),
                color: color(255),
                largura: userPlaylists[i].tracks.total
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
                addNewFlower(currentRecord.get('playlist'), currentRecord.get('x'), currentRecord.get('y'), currentRecord.get('largura'), currentRecord.get('color'));
            });
        }
    }, true);
}

function addNewFlower(name, x, y, largura, color) {
    newMountain = new classMountain(name, x, y, largura, color);
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

    constructor(name, x, y, largura, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.color  = color;
    }

    display() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.largura){
            this.c = color(0,200,255);

        } else {
            this.c = color(255);
        }

        stroke(this.c);
        strokeWeight(2);
        noFill();
        rectMode(CENTER);
        rect(this.x, this.y, this.largura * 2, this.largura * 2);

        noStroke();
        fill(this.c);
        textSize(12);
        text(this.name, this.x, this.y);
    }

}