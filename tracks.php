<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualiser</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">

    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.sound.js"></script>

    <script src="https://cdn.deepstream.io/js/client/latest/ds.min.js"></script>
</head>
<body>

<div class="menu">
    <div class="titulo">MENU</div>
    <div>
        Other People in the Room
        <div class="list-people">
            #list of people
        </div>
        <div>
            Choose a song to add to the artboard
            <div class="menu-option">MY PLAYLIST SONGS</div>
            <div class="menu-option">MY TOP SONGS</div>
            <div class="list-songs">
                #list of songs
            </div>
            <div class="menu-option">GENERATE PLAYLIST</div>
            <div class="menu-option">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

<script src="js/tracks.js"></script>
</body>
</html>
