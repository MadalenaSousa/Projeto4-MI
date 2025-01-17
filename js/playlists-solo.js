let userPlaylists, totalPlaylists;
let mountains = [];
let newMountain;
let remove;

let trackstotal=[];
let speedX=[];
let loudnessY=[];
let positivityCor=[];

function preload() {
    userPlaylists = loadJSON('php/' + userid + '-playlist-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth/6, windowHeight);
    totalPlaylists = Object.keys(userPlaylists).length;

    createUserDiv(user.name, user.profile_pic);
    createPlaylistDiv();
    logoutPopUp();
    sharePopUp();

    remove = document.querySelectorAll(".remove");

    for(let i = 0; i < totalPlaylists; i++) {
        trackstotal.push(userPlaylists[i].tracks.total);
        speedX.push(userPlaylists[i].average_features.speed);
        loudnessY.push(userPlaylists[i].average_features.loudness);
        positivityCor.push(userPlaylists[i].average_features.positivity);
    }


    for (let i = 0; i < totalPlaylists; i++) {
        document.querySelectorAll(".playlist")[i].addEventListener("click", function () {
            let mountainsId = [];
            for(let z = 0; z < mountains.length; z++) {
                mountainsId.push(mountains[z].id);
            }
            if(contains(mountainsId, userPlaylists[i].id) === false) {
                addNewMountain(
                    userPlaylists[i].name,
                    userPlaylists[i].id,
                    map(userPlaylists[i].average_features.speed, min(speedX), max(speedX), 110, width - 250),
                    map(userPlaylists[i].average_features.loudness, min(loudnessY), max(loudnessY), height - 110, 140),
                    map(userPlaylists[i].average_features.positivity, min(positivityCor), max(positivityCor), 0, 255),
                    userPlaylists[i].tracks.total,
                    map(userPlaylists[i].average_features.positivity, 0, 1.0, 13, 20),// número de "vértices"
                    map(userPlaylists[i].tracks.total, min(trackstotal), max(trackstotal), 20, 80), //tamanho
                    map(userPlaylists[i].average_features.energy, 0.0, 1.0, 30, 0), //quanto maior o valor, mais espalmada
                    map(userPlaylists[i].average_features.loudness, -60, 0, 0.3, 1), // valor=1 -> redonda
                    0,
                    map(userPlaylists[i].average_features.danceability, 0.0, 1.0, 0.01, 0.06), // dança do objeto
                    10, //intensidade
                    10);
                remove[i].classList.remove('hide');
            }
        });

        remove[i].addEventListener("click", function () {
            clearMountains(userPlaylists[i].name);
            remove[i].classList.add('hide');
        });
    }

    document.querySelector('.confirm-logout').addEventListener('click', function () {
        document.location = './homepage.php';
    });

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        resizeCanvas(windowHeight, windowHeight);
        saveCanvas('solo-playlists-artboard.png');
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



function addNewMountain(name, id, px, py, color, numtracks, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
    newMountain = new classMountain(name, id, px, py,  color, numtracks, resolution, tam, round, nAmp, t, tChange, nInt, nSeed);
    mountains.push(newMountain);
    console.log(mountains);
}

function clearMountains(playlist) {
   for(let i = 0; i < mountains.length; i++){
        if(mountains[i].name === playlist) {
            mountains.splice(i, 1);
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
        remove.classList.add('hide');
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

window.addEventListener('resize', function () {
    w = window.innerWidth - window.innerWidth / 6;
    h = window.innerHeight;
    resizeCanvas(w, h);
});

function draw() {
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

    constructor(name, id, px, py,color, numtracks, resolution, tam, round, nAmp, t, tChange, nInt, nSeed) {
        this.name = name;
        this.id = id;
        this.px = px;
        this.py = py;
        this.color  = color;
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
        if (dist(mouseX, mouseY, this.px, this.py) <= this.tam * 2) {
            this.t += this.tChange;
        }
        this.c = color(255 - this.color, 255, 255);
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
        vertex(this.px, this.py - 200 + (this.valor*10));
        vertex(this.px + 130, this.py - 200 + (this.valor*10));
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
        text("Added by " + split( user.name, ' ')[0], this.px + 10, this.py - 180 + (this.valor*6.2));
        textStyle(NORMAL);
        text("Energy: " + map(this.round, 30,0, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 160 + (this.valor*6.2));
        text("Danceability: " + map(this.tChange, 0.01, 0.06, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 140 + (this.valor*6.2));
        text("Positivity: " + map(this.color, 0,255, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 120 + (this.valor*6.2));
        text("Loudness: " + map(this.py, height,0, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 100 + (this.valor*6.2));
        text("Speed: " + map(this.px, 0, width, 0, 100).toFixed(1) + "%", this.px + 10, this.py - 80 + (this.valor*6.2));
        text("Total songs: " + this.numtracks, this.px + 10, this.py - 60 + (this.valor*6.2));

    }
}