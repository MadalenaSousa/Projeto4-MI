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

<div class="home-button"><a href="homepage.php">BACK TO HOMEPAGE</a></div>

<div class="menu">
    <div class="titulo">MENU</div>
    <div>
        Other People in the Room
        <div class="list-people">
            #list of people
        </div>
        <div>
            Choose an artist to add to the artboard
            <div class="menu-option">MY TOP ARTISTS</div>
            <div class="list-songs">
            </div>
            <div class="menu-option">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

<div id="lista"></div>

<script src="js/artists.js"></script>
</body>
</html>
