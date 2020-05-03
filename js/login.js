let xspacing = 2; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 50.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let cores = [0, 255, 255,
            255, 255, 0,
            255, 0, 255];

function setup() {
    createCanvas(windowWidth, windowHeight);
    w = width;
    dx = (TWO_PI / period) * xspacing;
    yvalues = new Array(floor(w / xspacing));
}

function draw() {
    background(0);
    calcWave();
    renderWave();
}

function calcWave() {
    // Increment theta (try different values for
    // 'angular velocity' here)
    theta += 0.02;

    // For every x value, calculate a y value with sine function
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] = (sin(x) * amplitude);
        x += dx;
    }
}

function renderWave() {
    noStroke();
    // A simple way to draw the wave with an ellipse at each location
    for(let i = 0; i < 9; i++) {
        fill(cores[i%3 * 3], cores[(i%3 * 3) + 1], cores[(i%3 * 3) + 2]);
        for (let x = 0; x < yvalues.length; x++) {
            ellipse(x * xspacing, (height - (i*200)) - yvalues[x], 2, 2);
        }
    }
}