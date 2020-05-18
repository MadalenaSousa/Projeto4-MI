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
var previewShare = document.createElement("div");
var cruz = document.createElement("div");
var botaoDownload = document.createElement("div");


let remove;
let alfa = 0;

const client = new DeepstreamClient('music-visualizer.duckdns.org:6020');
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
                createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
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
                        createUserDiv(clientsRecords[i].get('name'), clientsRecords[i].get('profile_pic'))
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
                    addNewWave(recordsOnList[i].get('artist'), recordsOnList[i].get('color'), recordsOnList[i].get('divisoes'), recordsOnList[i].get('largura'), recordsOnList[i].get('x'), recordsOnList[i].get('y'), recordsOnList[i].get('shake'), recordsOnList[i].get('valorX'), recordsOnList[i].get('valorY'), recordsOnList[i].get('id'), recordsOnList[i].get('user'));
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
        console.log(windowWidth);


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
                        largura: map(artists[i].popularity, min(popularity), max(popularity), windowWidth/(windowWidth/100), windowWidth/(windowWidth/400)),
                        x: map(artists[i].top_tracks_average_features.speed, min(speed), max(speed), windowWidth/(windowWidth/300), windowWidth - (windowWidth / 26) - 375),
                        y: map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), 250, windowHeight - ( windowWidth/(windowWidth/400))/4),
                        shake: map(artists[i].top_tracks_average_features.energy, min(energy), max(energy), 1, 2),
                        valorX: map(artists[i].top_tracks_average_features.speed, min(speed), max(speed), 125, windowWidth - (windowWidth / 26) - 375),
                        valorY: map(artists[i].top_tracks_average_features.loudness, min(loudness), max(loudness), 250, windowHeight - 50),
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
        document.querySelector('.share').classList.add('hide');

        previewShare.classList.add("PreviewShare");
        cruz.classList.add("cruz");
        previewShare.style.outline = "outline: 2px solid white";

        previewShare.style.zIndex = "10000";
        previewShare.style.outline = "2px solid white";
        previewShare.style.background = "black";
        previewShare.style.position = 'fixed';
        previewShare.style.width = '26%';
        previewShare.style.height = '60%';
        previewShare.style.left = '30%';
        previewShare.style.top = '50%';
        previewShare.style.transform = "translateX(-50%)";
        previewShare.style.transform = "translateY(-50%)";
        previewShare.style.display = "block";


        cruz.style.color = "white";
        cruz.innerText = "X";
        cruz.style.zIndex = "10000";
        cruz.style.position = 'fixed';
        cruz.style.width = 'fit-content';
        cruz.style.height = 'fit-content';
        cruz.style.left = '92%';
        cruz.style.top = '3%';
        cruz.style.cursor = "pointer";
        cruz.style.display = "block";

        botaoDownload.onmouseenter = function () {
            botaoDownload.style.color = "black";
            botaoDownload.style.background = "white";
        };

        botaoDownload.onmouseleave = function () {
            botaoDownload.style.color = "white";
            botaoDownload.style.background = "black";
        };

        botaoDownload.innerText = "DOWNLOAD IMAGE";
        botaoDownload.style.zIndex = "10000";
        botaoDownload.style.position = 'fixed';
        botaoDownload.style.width = 'fit-content';
        botaoDownload.style.height = '8%';
        botaoDownload.style.left = '0%';
        botaoDownload.style.top = '92%';
        botaoDownload.style.cursor = "pointer";
        botaoDownload.style.display = "block";
        botaoDownload.style.paddingTop = "2%";
        botaoDownload.style.outline = "2px solid white";
        botaoDownload.style.width = "100%";


        document.body.appendChild(previewShare);
        document.querySelector('.PreviewShare').appendChild(cruz);
        document.querySelector('.PreviewShare').appendChild(botaoDownload);
        let width = 0.20 * windowWidth;
        let height = 0.20 * windowWidth;

        let canvas = document.getElementById('defaultCanvas0');
        let img = new Image(width, height); //crio uma imagem
        img.src = canvas.toDataURL('image/jpeg', 0.01); //torno a src da imagem o canvas convertido num link
        img.classList.add("imagemPreview");
        img.style.outline = "1px solid white";
        img.style.position = "fixed";
        img.style.left = "10%";
        img.style.top = "11%";
        img.style.width = "80%";
        img.style.height = "70%";


        document.querySelector('.PreviewShare').appendChild(img);  //faço append na div onde quero pôr o preview


        botaoDownload.addEventListener('click', function () {
            console.log('Canvas will be downloaded');
            resizeCanvas(windowHeight, windowHeight);
            saveCanvas( 'public-artists-artboard.png');
            resizeCanvas(windowWidth - windowWidth/6, windowHeight);
        });

    });
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

function draw() {

    if (cruz.style.display === "block" || previewShare.style.display === "block") {
        document.querySelector(".cruz").addEventListener('click', function () {
            document.querySelector('.cruz').style.display = "none";
            document.querySelector('.PreviewShare').style.display = "none";
            document.querySelector('.overlay').classList.add('hide')
        });
    }

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
        } else if (this.valorY >= ((2 * (this.largura / 2)) / 3) + 180) {
            if (this.verificar === true && (mouseX > this.x && mouseX < this.x + 130 && mouseY > this.y - ((2 * (this.largura / 2)) / 3) - 180 && mouseY < this.y - ((2 * (this.largura / 2)) / 3) - 20)) {
                this.balao();
            }
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
                text("Loudness: " + map(this.valorY, 250, windowHeight - 50, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 90);
                text("Speed: " + map(this.valorX, 125, windowWidth - (windowWidth / 26) - 375, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * (this.largura / 2)) / 3) - 70);

                fill(0);
                stroke(255, 255 - this.color, 255);
                rect(this.x + 10, (this.y - ((2 * (this.largura / 2)) / 3)) - 50, 110, 20);
                noStroke();
                fill(255, 255 - this.color, 255);
                textSize(10);
                text("Visit Artist's Page", this.x + 30, (this.y - ((2 * (this.largura / 2)) / 3)) - 37);

                if (mouseIsPressed && mouseX > this.x + 10 && mouseX < this.x + 10 + 110 && mouseY > (this.y - ((2 * (this.largura / 2)) / 3)) - 50 && mouseY < (this.y - ((2 * (this.largura / 2)) / 3)) - 50 + 20) {
                    window.open("https://open.spotify.com/artist/" + this.id, "_blank");
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
                text("Danceability: " + map(this.divisoes, 3, 10, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 130);
                text("Positivity: " + map(this.largura, 100, 400, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 110);
                text("Loudness: " + map(this.valorY, 250, windowHeight - 50, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 90);
                text("Speed: " + map(this.valorX, 125, windowWidth - (windowWidth / 26) - 375, 0, 100).toFixed(1) + "%", this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 70);

                fill(0);
                stroke(255, 255 - this.color, 255);
                rect(this.x + 10, this.y - ((2 * this.largura / 2) / 3) + 150, 110, 20);
                noStroke();
                fill(255, 255 - this.color, 255);
                textSize(10);
                text("Visit Artist's Page", this.x + 30, this.y - ((2 * this.largura / 2) / 3) + 163);

                if (mouseIsPressed && mouseX > this.x + 10 && mouseX < this.x + 10 + 110 && mouseY > (this.y - ((2 * this.largura / 2) / 3) + 150) && mouseY < (this.y - ((2 * this.largura / 2) / 3) + 150 + 20)) {
                    window.open("https://open.spotify.com/artist/" + this.id, "_blank");
                }


            }


        }

    }
}

