let user, artists, totalArtists, topArtists;
let waves = [];
let newWave;
let popularity = [];
let followers = [];
let speed = [];
let positivity = [];
let danceability = [];
let loudness = [];
let energy = [];
let id = [];

let remove;
let alfa = 0;

function preload() {
    topArtists = loadJSON('php/' + userid + '-artists-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth / 6, windowHeight);

    artists = topArtists;
    totalArtists = Object.keys(artists).length;

    createArtistDiv();
    createUserDiv(user.name, user.profile_pic);
    logoutPopUp();
    sharePopUp();

    remove = document.querySelectorAll(".remove");


    for (let i = 0; i < totalArtists; i++) {
        popularity.push(artists[i].popularity);
        danceability.push(artists[i].top_tracks_average_features.danceability);
        followers.push(artists[i].followers.total);
        speed.push(artists[i].top_tracks_average_features.speed);
        positivity.push(artists[i].top_tracks_average_features.positivity);
        loudness.push(artists[i].top_tracks_average_features.loudness);
        energy.push(artists[i].top_tracks_average_features.energy);
        id.push(artists[i].id);

    }

    for (let i = 0; i < totalArtists; i++) {
        document.querySelectorAll(".artist")[i].addEventListener("click", function () {
            let wavesId = [];
            for(let z = 0; z < waves.length; z++) {
                wavesId.push(waves[z].id);
            }
            if(contains(wavesId, artists[i].id) === false) {
                addNewWave(
                    artists[i].name,
                    map(artists[i].top_tracks_average_features.positivity, min(positivity), max(positivity), 0, 255),
                    map(artists[i].top_tracks_average_features.danceability, min(danceability), max(danceability), 3, 10),
                    map(artists[i].popularity, min(popularity), max(popularity), width / (width / 100), width / (width / 400)),
                    map(artists[i].top_tracks_average_features.speed, min(speed), max(speed), width / (width / 300), width - 170),
                    map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), height - (width / (width / 400)) / 4, 250),
                    map(artists[i].top_tracks_average_features.energy, min(energy), max(energy), 1, 2),
                    map(artists[i].top_tracks_average_features.speed, min(speed), max(speed), width / (width / 300), width - 170),
                    map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), height - (width / (width / 400)) / 4, 250),
                    id[i]);
                remove[i].classList.remove('hide');
            }
        });

        remove[i].addEventListener("click", function () {
            removeWave(artists[i].name);
            remove[i].classList.add('hide');
        });
    }


    document.querySelector('.confirm-logout').addEventListener('click', function () {
        document.location = './homepage.php';
    });

    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        resizeCanvas(windowHeight, windowHeight);
        saveCanvas('solo-artists-artboard.png');
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



function addNewWave(name, color, divisoes, largura, x, y, shake, valorX, valorY, id) {
    newWave = new waveArtist(name, color, divisoes, largura, x, y, shake, valorX, valorY, id);
    waves.push(newWave);
    console.log("LISTA DE ONDAS ATUAL: " + waves);
}

function removeWave(artist) {
    for (let i = 0; i < waves.length; i++) {
        if (waves[i].name === artist) {
            waves.splice(i, 1);
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
        document.querySelector('.logout').classList.toggle('hide');
        document.querySelector('.overlay').classList.toggle('hide');
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
        document.querySelector('.share').classList.toggle('hide');
        document.querySelector('.overlay').classList.toggle('hide');

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

function createArtistDiv() {
    for (let i = 0; i < totalArtists; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('artist');

        nome.innerHTML = '<b>' + artists[i].name + '</b>';

        nomeDiv.appendChild(nome);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.classList.add("removeArtists");
        remove.classList.add("hide");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        song.classList.add('unit');

        song.appendChild(nomeDiv);
        song.appendChild(remove);
        document.querySelector(".list-songs").appendChild(song);
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

function cleanCreatePlaylistPreview() {
    let arrayDivs = document.querySelectorAll('.preview img');

    for(let i = 0; i < arrayDivs.length; i++) {
        arrayDivs[i].remove();
    }
}

window.addEventListener('resize', function () {
    w = window.innerWidth - window.innerWidth / 6;
    h = window.innerHeight;
    resizeCanvas(w, h);
});

function draw() {

    background(0);
    alfa = alfa + (PI / 56);
    if (waves.length > 0) {
        for (let i = 0; i < waves.length; i++) {
            waves[i].display();
        }
        for (let i = 0; i < waves.length; i++) {
            waves[i].aparecer();

        }
    }
}

class waveArtist {
    verificar;

    constructor(name, color, divisoes, largura, x, y, shake, valorX, valorY, id) {
        this.name = name;
        this.color = color;
        this.divisoes = divisoes;
        this.largura = largura;
        this.x = x;
        this.y = y;
        this.shake = shake;
        this.valorX = valorX;
        this.valorY = valorY;
        this.id = id;
    }



    display() {
        this.onda();
    }

    aparecer() {
        if (dist(mouseX, mouseY, this.x, this.y - (this.largura / 3)) <= this.largura / 6) {
            this.balao();
            this.verificar = true;
            this.y = this.y + 0.2 * sin(alfa * this.shake);
            this.x = this.x + 0.2 * cos(alfa * this.shake);
        } else if (this.valorY >= ((2 * (this.largura / 2)) / 3) + 180 && this.verificar === true && (mouseX > this.x && mouseX < this.x + 130 && mouseY > this.y - ((2 * (this.largura / 2)) / 3) - 180 && mouseY < this.y - ((2 * (this.largura / 2)) / 3) - 20)) {
            this.balao();

        } else if (this.verificar === true && (mouseX > this.x && mouseX < this.x + 130 && mouseY > this.y - ((2 * this.largura / 2) / 3) && mouseY < this.y - ((2 * this.largura / 2) / 3) + 180)) {
            this.balao();
        } else {
            this.verificar = false;
            this.x = this.valorX;
            this.y = this.valorY;

        }
    }

    onda() {
        stroke(255, 255 - this.color, 255);
        fill(0);
        strokeWeight(2);
        stroke(255, 255 - this.color, 255);
        beginShape();
        fill(0);
        vertex(this.x - this.largura, this.y - 0);
        bezierVertex(this.x - this.largura, this.y - 0, this.x - (this.largura / 2) - (this.largura * (1 / 12)), this.y - 0, this.x - (this.largura / 2), this.y - ((4 / 15) * (this.largura / 2)));
        bezierVertex(this.x - (this.largura / 2) + (1 / 30) * this.largura, this.y - ((4 / 15) * (this.largura / 2)) - ((1 / 10) * (this.largura / 2)), this.x - (4 * (this.largura / 15)), this.y - (this.largura / 2), this.x - 0, this.y - (this.largura / 2));
        bezierVertex(this.x + (this.largura / 5), this.y - (this.largura / 2), this.x + (this.largura / 5), this.y - (this.largura / 6), this.x - 0, this.y - (this.largura / 6));
        bezierVertex(this.x - (2 * (this.largura / 15)), this.y - (this.largura / 6), this.x - (2 * (this.largura / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - 0, this.y - ((2 * (this.largura / 2)) / 3));
        bezierVertex(this.x - (2 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - (2 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))));
        bezierVertex((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * (this.divisoes), this.y - (this.largura / 6) - ((this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), (this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * (this.divisoes), this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))));
        bezierVertex(this.x - (4 * ((this.largura - (this.divisoes) * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((this.largura / 2) - (this.divisoes) * ((this.largura / 2) / (this.divisoes * 3))), (this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes))) + ((1 / 30) * this.largura), (this.y - ((4 / 15) * (this.largura / 2))) - ((1 / 10) * (this.largura / 2)), this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes)), this.y - ((4 / 15) * (this.largura / 2)));
        bezierVertex((this.x - (this.largura / 2) + ((this.divisoes) * (((3 / 10) * this.largura) / this.divisoes))) - (this.largura * (1 / 12)), this.y - 0, (this.x - this.largura) + ((this.divisoes) * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0, (this.x - this.largura) + ((this.divisoes) * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0);
        vertex(this.x - this.largura, this.y - 0);
        endShape();


        noFill();

        for (let i = 0; i < this.divisoes; i++) {
            strokeWeight(2);
            beginShape();
            vertex((this.x - this.largura) + (i * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0);
            bezierVertex((this.x - this.largura) + (i * (((3 / 5) * this.largura) / this.divisoes)), this.y - 0, (this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes))) - (this.largura * (1 / 12)), this.y - 0, this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes)), this.y - ((4 / 15) * (this.largura / 2)));
            bezierVertex((this.x - (this.largura / 2) + (i * (((3 / 10) * this.largura) / this.divisoes))) + ((1 / 30) * this.largura), (this.y - ((4 / 15) * (this.largura / 2))) - ((1 / 10) * (this.largura / 2)), this.x - (4 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))));
            bezierVertex((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * i, this.y - ((this.largura / 2) - i * ((this.largura / 2) / (this.divisoes * 3))), ((this.x + (this.largura / 5)) - (((6 * this.largura) / 30) / this.divisoes) * i), this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))), this.x - 0, this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))));
            bezierVertex(this.x - (2 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - (this.largura / 6) - (i * ((this.largura / 2) / (this.divisoes * 3))), this.x - (2 * ((this.largura - i * ((6 * this.largura) / (this.divisoes * 7))) / 15)), this.y - ((2 * (this.largura / 2)) / 3), this.x - 0, this.y - ((2 * (this.largura / 2)) / 3));
            endShape();
        }

        textAlign(LEFT);
        noStroke();
        fill(255, 255 - this.color, 255);
//        text(this.name, (this.x-this.largura - (this.name.length * 6.5)), this.y - 10, 136);
        textSize(14);
        text(this.name, (this.x - this.largura / 4), this.y - 10, 136);

    }

    balao() {
        for (let i = 0; i < totalArtists; i++) {

            fill(0);
            strokeWeight(2);
            stroke(255, 255 - this.color, 255);
            if (this.valorY >= ((2 * (this.largura / 2)) / 3) + 180) {
                beginShape();
                vertex(this.x - 0, this.y - ((2 * (this.largura / 2)) / 3) - 188);
                vertex(this.x + 130, this.y - ((2 * (this.largura / 2)) / 3) - 188);
                vertex(this.x + 130, this.y - ((2 * (this.largura / 2)) / 3) - 20);
                vertex(this.x + 30, this.y - ((2 * (this.largura / 2)) / 3) - 20);
                vertex(this.x, this.y - ((2 * (this.largura / 2)) / 3));
                vertex(this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 20);
                vertex(this.x, this.y - ((2 * (this.largura / 2)) / 3) - 20);
                endShape(CLOSE);

                noStroke();

                fill(255, 255 - this.color, 255);
                textStyle(BOLD);
                textSize(12);
                text("Added by " + split( user.name, ' ')[0], this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 165);
                textStyle(NORMAL);
                text("Energy: " + map(this.shake, 1, 2, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 145);
                text("Danceability: " + map(this.divisoes, 3, 10, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 125);
                text("Positivity: " + map(this.largura, 100, 400, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 105);
                text("Loudness: " + map(this.valorY, 250, height - 50, 100, 0).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 85);
                text("Speed: " + map(this.valorX, 125, width - 170, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 65);


                if (mouseX > this.x + 10 && mouseX < this.x + 10 + 110 && mouseY > (this.y - ((2 * (this.largura / 2)) / 3)) - 50 && mouseY < (this.y - ((2 * (this.largura / 2)) / 3)) - 50 + 20) {
                    if (mouseIsPressed) {
                        window.open("https://open.spotify.com/artist/" + this.id, "_blank");
                    }
                    fill(255, 255 - this.color, 255);
                    stroke(0);
                    rect(this.x + 10, (this.y - ((2 * (this.largura / 2)) / 3)) - 50, 110, 20);
                    noStroke();
                    fill(0);
                    textSize(10);
                    text("Visit Artist's Page", this.x + 30, (this.y - ((2 * (this.largura / 2)) / 3)) - 37);
                } else {
                    fill(0);
                    stroke(255, 255 - this.color, 255);
                    rect(this.x + 10, (this.y - ((2 * (this.largura / 2)) / 3)) - 50, 110, 20);
                    noStroke();
                    fill(255, 255 - this.color, 255);
                    textSize(10);
                    text("Visit Artist's Page", this.x + 30, (this.y - ((2 * (this.largura / 2)) / 3)) - 37);
                }


            } else {
                beginShape();
                vertex(this.x - 0, this.y - ((2 * this.largura / 2) / 3) + 180);
                vertex(this.x + 130, this.y - ((2 * this.largura / 2) / 3) + 180);
                vertex(this.x + 130, this.y - ((2 * this.largura / 2) / 3) + 15);
                vertex(this.x + 30, this.y - ((2 * this.largura / 2) / 3) + 15);
                vertex(this.x, this.y - ((2 * this.largura / 2) / 3));
                vertex(this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 15);
                vertex(this.x, this.y - ((2 * this.largura / 2) / 3) + 15);
                endShape(CLOSE);

                noStroke();

                fill(255, 255 - this.color, 255);
                textStyle(BOLD);
                textSize(12);
                text("Added by " + split( user.name, ' ')[0], this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 35);
                textStyle(NORMAL);
                text("Speed: " + map(this.valorX, 125, width - 170, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 135);
                text("Loudness: " + map(this.valorY, 250, height - 50, 100, 0).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 115);
                text("Positivity: " + map(this.largura, 100, 400, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 95);
                text("Danceability: " + map(this.divisoes, 3, 10, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 75);
                text("Energy: " + map(this.shake, 1, 2, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 55);


                if (mouseX > this.x + 10 && mouseX < this.x + 10 + 110 && mouseY > (this.y - ((2 * this.largura / 2) / 3) + 150) && mouseY < (this.y - ((2 * this.largura / 2) / 3) + 150 + 20)) {

                    if (mouseIsPressed) {
                        window.open("https://open.spotify.com/artist/" + this.id, "_blank");
                    }

                    fill(255, 255 - this.color, 255);
                    stroke(0);
                    rect(this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 150, 110, 20);
                    noStroke();
                    fill(0);
                    textSize(10);
                    text("Visit Artist's Page", this.x + 30, this.y - ((2 * this.largura / 2) / 3) + 163);


                } else {
                    fill(0);
                    stroke(255, 255 - this.color, 255);
                    rect(this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 150, 110, 20);
                    noStroke();
                    fill(255, 255 - this.color, 255);
                    textSize(10);
                    text("Visit Artist's Page", this.x + 30, this.y - ((2 * this.largura / 2) / 3) + 163);
                }


            }


        }

    }
}
