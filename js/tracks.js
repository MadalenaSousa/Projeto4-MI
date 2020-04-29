let playlistSongs, topSongs, user, songs, totalSongs;
let fromPlaylist = false;
let flowers = [];
let newFlower;
let remove;

const client = new DeepstreamClient('localhost:6020');
const record = [];
let personRecord;
let clientsRecords = [];
let recordList;

function preload() {
    playlistSongs = loadJSON('php/' + userid +'-playlist-songs-object.json');
    topSongs = loadJSON('php/' + userid + '-top-songs-object.json');
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
    });

    songs = topSongs;
    totalSongs = Object.keys(songs).length;

    createUserDiv(user.name, user.profile_pic);
    createSongDiv();

    recordList = client.record.getList('all-songs');
    remove = document.querySelectorAll(".remove");

    recordList.subscribe(function () {
        console.log("LISTA DE RECORDS ATUAL: " + recordList.getEntries());
        if(recordList.isEmpty()) {
            clearArray(flowers);
            console.log("Não há músicas na lista");
        } else {
            clearArray(flowers);
            let recordsOnList = [];
            for(let i = 0; i < recordList.getEntries().length; i++){
                recordsOnList[i] = client.record.getRecord(recordList.getEntries()[i]);
                recordsOnList[i].whenReady(function () {
                    addNewFlower(recordsOnList[i].get('song'), recordsOnList[i].get('x'), recordsOnList[i].get('y'), recordsOnList[i].get('raio'), recordsOnList[i].get('color'),
                        recordsOnList[i].get('energy'), recordsOnList[i].get('energy'), recordsOnList[i].get('url'), recordsOnList[i].get('artist'));
                });
            }
        }
    });

    for (let i = 0; i < totalSongs; i++) {
        recordList.subscribe(function () {
            if(contains(recordList.getEntries(), songs[i].name)){
                remove[i].classList.remove('hide');
            } else {
                remove[i].classList.add('hide');
            }
        });

        document.querySelectorAll(".song")[i].addEventListener("click", function () {
            console.log("Clicou na música " + songs[i].name);
            client.record.has(songs[i].name, function (error, hasRecord) {
                if (hasRecord === false) {
                    console.log('doesnt have record with name: ' + songs[i].name + ", can create it");
                    record[i] = client.record.getRecord(songs[i].name);
                    record[i].set({
                        user: "user",
                        song: songs[i].name,
                        x: (songs[i].duration / 2) + ((width - (songs[i].duration / 2)) / totalSongs) * i,
                        y: height - (songs[i].duration / 2),
                        raio: (songs[i].duration / 3),
                        color: map(getAudioFeatures(i).positivity, 0, 1, 0, 255),
                        energy: getAudioFeatures(i).energy * 5,
                        artist: songs[i].artists,
                        url: songs[i].preview_url
                    });

                    recordList.addEntry(songs[i].name);

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Record with name: ' + songs[i].name + ", already exists, cannot create it");
                }
            });

        });

       remove[i].addEventListener("click", function () {
            client.record.has(songs[i].name, function (error, hasRecord) {
                if (hasRecord) {
                    console.log('Has record with name: ' + songs[i].name + ', can delete it');

                    recordList.removeEntry(songs[i].name);
                    client.record.getRecord(songs[i].name).delete();

                    console.log("NOVA LISTA: " + recordList.getEntries());
                } else {
                    console.log('Doesnt have record with name: ' + songs[i].name + ', cannot delete it');
                }
            });
        });

    }
}

function addNewFlower(name, x, y, raio, color, shakeX, shakeY, url, artist) {
    newFlower = new flowerSong(name, x, y, raio, color, shakeX, shakeY, url, artist);
    flowers.push(newFlower);
    console.log("LISTA DE FLORES ATUAL: " + flowers);
}

function clearArray(array) {
    array.splice(0, array.length);
}

function contains(array, nome) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === nome) {
            return true;
        }
    }
    return false;
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

function createSongDiv() {
    for(let i = 0; i < totalSongs; i++) {
        let song = document.createElement("div");

        let nomeDiv = document.createElement("div");
        let nome = document.createElement("span");
        let artista = document.createElement("div");

        let remove = document.createElement("div");

        nomeDiv.setAttribute("style", "margin: 0px");
        nomeDiv.classList.add('song');

        nome.innerHTML ='<b>' + songs[i].name + '</b>';

        artista.setAttribute("style", "font-size: 10pt");
        artista.innerHTML = songs[i].artists;

        nomeDiv.appendChild(nome);
        nomeDiv.appendChild(artista);

        remove.innerText = "x";
        remove.classList.add("remove");
        remove.classList.add("hide");
        remove.setAttribute("style", "cursor: pointer; margin-left: 5px;");

        song.classList.add('unit');

        song.appendChild(nomeDiv);
        song.appendChild(remove);
        document.querySelector(".list-songs").appendChild(song);
    }
}

function draw() {
    background(0);

    if(fromPlaylist) {
        songs = playlistSongs;
        totalSongs = Object.keys(songs).length;
    } else {
        songs = topSongs;
        totalSongs = Object.keys(songs).length;
    }

    if(flowers.length > 0) {
        for(let i = 0; i < flowers.length; i++) {
                flowers[i].display();
        }
    }
}

function mousePressed() {
    for(let i = 0; i < flowers.length; i++) {
        flowers[i].playSong();
    }
}

function getAudioFeatures(index) {
    return songs[index].audio_features;
}

class flowerSong {
    c;
    randomX;
    randomY;
    musicOn;
    sound;

    constructor(name, x, y, raio, color, shakeX, shakeY, url, artist) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.color  = color;
        this.shakeX = shakeX;
        this.shakeY = shakeY;
        this.artist = artist;

        this.sound = new Audio(url);
        this.musicOn = false;
    }

    display() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.c = color(255, 255, this.color);
            this.randomX = random(-this.shakeX, this.shakeX);
            this.randomY = random(-this.shakeY, this.shakeY);

        } else {
            this.c = color(255);
            this.randomX = 0;
            this.randomY = 0;
        }

        if(this.musicOn){
            this.sound.play();
        } else {
            this.sound.pause();
        }

        stroke(this.c);
        strokeWeight(2);
        noFill();
        //ellipse(this.x + this.randomX, this.y + this.randomY, this.raio * 2, this.raio * 2);
        for (let i = 0; i < 4; i++) {
            this.flor(this.x + this.randomX, this.y + this.randomY, 10, 60-i*15, 65-i*15);
        }

        noStroke();
        fill(this.c);
        textSize(12);
        textStyle(BOLD);
        text(this.name, this.x, this.y);
        textSize(10);
        textStyle(NORMAL);
        text(this.artist, this.x, this.y + 10);
    }

    playSong() {
        if(dist(mouseX, mouseY, this.x, this.y) <= this.raio){
            this.musicOn = !this.musicOn;
        }
    }

    flor(x, y, nVert, rG, rP) {
        let alpha = TWO_PI/nVert;
        beginShape();
            for (let i = 0; i <= nVert+1; i++) {
            curveVertex(x+rG*cos(i*alpha), y+rG*sin(i*alpha));
            curveVertex(x+rP*cos(i*alpha+alpha/2), y+rP*sin(i*alpha+alpha/2));
            }
        endShape();
    }
}