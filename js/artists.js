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

const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

function preload() {
    topArtists = loadJSON('php/' + userid + '-artists-object.json');
    user = loadJSON('php/' + userid + '-user-object.json');
}

function setup() {
    createCanvas(windowWidth - windowWidth / 6, windowHeight);

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
        for (let i = 0; i < clients.length; i++) {
            console.log('Clients present on login: ' + clients);
            clientsRecords[i] = client.record.getRecord(clients[i]);
            clientsRecords[i].subscribe(function () {
                if ((clientsRecords[i].get('name') !== undefined)) {
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
                        if ((clientsRecords[i].get('name') !== undefined)) {
                            createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'));
                        }
                    });
                }
            });
        }
    });

    artists = topArtists;
    totalArtists = Object.keys(artists).length;

    createArtistDiv();
    createUserDiv(user.name, user.profile_pic);
    logoutPopUp();
    sharePopUp();
    backToHomepagePopUp();

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

    recordList = client.record.getList('all-artists');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if (recordList.isEmpty()) {
            clearWaves();
            console.log("Não há músicas na lista");
        } else {
            clearWaves();
            let recordsOnList = [];
            for (let i = 0; i < recordList.getEntries().length; i++) {
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    let speedX = 0;
                    let speedValorX = 0;
                    if (recordsOnList[i].get('x') > max(speed)) {
                        speedX = width - 170;
                    } else if (recordsOnList[i].get('x') < min(speed)) {
                        speedX = width / (width / 300);
                    } else {
                        speedX = map(recordsOnList[i].get('x'), min(speed), max(speed), width / (width / 300), width - 170);
                    }
                    if (recordsOnList[i].get('valorX') > max(speed)) {
                        speedValorX = width - 170;
                    } else if (recordsOnList[i].get('valorX') < min(speed)) {
                        speedValorX = width / (width / 300);
                    } else {
                        speedValorX = map(recordsOnList[i].get('valorX'), min(speed), max(speed), width / (width / 300), width - 170);
                    }
                    addNewWave(recordsOnList[i].get('artist'), recordsOnList[i].get('color'), recordsOnList[i].get('divisoes'), recordsOnList[i].get('largura'), speedX, recordsOnList[i].get('y'), recordsOnList[i].get('shake'), speedValorX, recordsOnList[i].get('valorY'), recordsOnList[i].get('id'), recordsOnList[i].get('user'));
                });
            }
        }
    });

    for (let i = 0; i < totalArtists; i++) {
        recordList.subscribe(function () {
            if (contains(recordList.getEntries(), artists[i].name)) {
                remove[i].classList.remove('hide');
            } else {
                remove[i].classList.add('hide');
            }
        });


        document.querySelectorAll(".artist")[i].addEventListener("click", function () {
            console.log("Clicou na música" + artists[i].name);
            client.record.has(artists[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + topArtists[i].name + ", can create it");
                    record[i] = client.record.getRecord(artists[i].name); //crio um novo record no servidor
                    record[i].set({ //defino o novo record
                        user: user.name,
                        artist: artists[i].name,
                        color: map(artists[i].top_tracks_average_features.positivity, min(positivity), max(positivity), 0, 255),
                        divisoes: map(artists[i].top_tracks_average_features.danceability, min(danceability), max(danceability), 3, 10),
                        largura: map(artists[i].popularity, min(popularity), max(popularity), width / (width / 100), width / (width / 400)),
                        x: artists[i].top_tracks_average_features.speed,
                        y: map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), height - (width / (width / 400)) / 4, 250),
                        shake: map(artists[i].top_tracks_average_features.energy, min(energy), max(energy), 1, 2),
                        valorX: artists[i].top_tracks_average_features.speed,
                        valorY: map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), height - (width / (width / 400)) / 4, 250),
                        id: id[i]

                    });

                    recordList.addEntry(artists[i].name);

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + artists[i].name + ", already exists, cannot create it");
                }
            });

        });

        remove[i].addEventListener("click", function () {
            client.record.has(artists[i].name, function (error, hasRecord) {
                if (hasRecord) {
                    console.log('Has record with name: ' + artists[i].name + ', can delete it');

                    recordList.removeEntry(artists[i].name);
                    client.record.getRecord(artists[i].name).delete();

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Doesnt have record with name: ' + artists[i].name + ', cannot delete it');
                }
            });
        });

    }

    document.querySelector('.confirm-logout').addEventListener('click', closeArtistRoomConnection);


    document.querySelector('.download').addEventListener('click', function () {
        console.log('Canvas will be downloaded');
        resizeCanvas(windowHeight, windowHeight);
        saveCanvas('public-artists-artboard.png');
        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);
    });
}


document.querySelector('.info').addEventListener('click', abrirPopupInfo);
document.querySelector('.fechar-info').addEventListener('click', fecharPopupInfo);


function abrirPopupInfo() {
    document.querySelector('.popup-info').style.display = "block";
    document.querySelector('.overlay').classList.remove('hide');
}

function fecharPopupInfo() {
    document.querySelector('.popup-info').style.display = "none";
    document.querySelector('.overlay').classList.add('hide');
}


function addNewWave(name, color, divisoes, largura, x, y, shake, valorX, valorY, id, owner) {
    newWave = new waveArtist(name, color, divisoes, largura, x, y, shake, valorX, valorY, id, owner);
    waves.push(newWave);
    console.log(waves);
}

function clearWaves() {
    waves.splice(0, waves.length);
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
        closeArtistRoomConnection();
    });
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
        resizeCanvas(windowWidth - windowWidth / 6, windowHeight);
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

    for (let i = 0; i < arrayDivs.length; i++) {
        arrayDivs[i].remove();
    }
}

function closeArtistRoomConnection() {
    let allRecords = [];
    let recordsToRemove = [];

    for (let i = 0; i < recordList.getEntries().length; i++) {
        allRecords[i] = client.record.getRecord(recordList.getEntries()[i]);
        allRecords[i].whenReady(function () {
            console.log('Record to delete: ' + allRecords[i].get('artist') + ' Owner of the record: ' + allRecords[i].get('user'));
            if (allRecords[i].get('user') === user.name) {
                recordsToRemove.push(allRecords[i]);
            }
        });
    }

    if (recordsToRemove.length === 0) {
        client.close();
    } else {
        for (let i = 0; i < recordsToRemove.length; i++) {
            recordList.removeEntry(recordsToRemove[i].get('artist'));
            client.record.getRecord(recordsToRemove[i].get('artist')).delete();
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

    constructor(name, color, divisoes, largura, x, y, shake, valorX, valorY, id, owner) {
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
        this.owner = owner;
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
                vertex(this.x - 0, this.y - ((2 * (this.largura / 2)) / 3) - 180);
                vertex(this.x + 130, this.y - ((2 * (this.largura / 2)) / 3) - 180);
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
                text("Added by " + split(this.owner, ' ')[0], this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 155);
                textStyle(NORMAL);
                text("Danceability: " + map(this.divisoes, 3, 10, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 130);
                text("Positivity: " + map(this.largura, 100, 400, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 110);
                text("Loudness: " + map(this.valorY, 250, height - 50, 100, 0).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 90);
                text("Speed: " + map(this.valorX, 125, width - 170, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 70);


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
                vertex(this.x + 130, this.y - ((2 * this.largura / 2) / 3) + 20);
                vertex(this.x + 30, this.y - ((2 * this.largura / 2) / 3) + 20);
                vertex(this.x, this.y - ((2 * this.largura / 2) / 3));
                vertex(this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 20);
                vertex(this.x, this.y - ((2 * this.largura / 2) / 3) + 20);
                endShape(CLOSE);

                noStroke();

                fill(255, 255 - this.color, 255);
                textStyle(BOLD);
                textSize(12);
                text("Added by " + split(this.owner, ' ')[0], this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 45);
                textStyle(NORMAL);
                text("Speed: " + map(this.valorX, 125, width - 170, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 130);
                text("Loudness: " + map(this.valorY, 250, height - 50, 100, 0).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 110);
                text("Positivity: " + map(this.largura, 100, 400, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 90);
                text("Danceability: " + map(this.divisoes, 3, 10, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 70);


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

