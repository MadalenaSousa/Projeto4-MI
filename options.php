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
</head>
<body style="background-color: black">

<a href="php/getPlaylists&Tracks.php">
    <div class="option">
        MY PLAYLISTS
    </div>
</a>

<a href="php/getPlaylists&Tracks.php">
    <div class="option">
        MY TRACKS
    </div>
</a>

<a href="php/getArtistsInfo.php">
    <div class="option">
        ARTISTS
    </div>
</a>

<a href="php/getAlbunsInfo.php">
    <div class="option">
        ALBUMS
    </div>
</a>

</body>
</html>