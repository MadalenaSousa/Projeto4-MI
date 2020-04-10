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

<div>
    PLAYLISTS ROOM
    <a href="#">
        <div class="option">
            PUBLIC ROOM
        </div>
    </a>
    <a href="#">
        <div class="option">
            WITH FRIENDS
        </div>
    </a>
    <a href="php/getPlaylistsInfo.php">
        <div class="option">
            ONLY ME
        </div>
    </a>
</div>

<div>
    SONGS ROOM
    <a href="#">
        <div class="option">
            PUBLIC ROOM
        </div>
    </a>
    <a href="#">
        <div class="option">
            WITH FRIENDS
        </div>
    </a>
    <a href="php/getTracksInfo.php">
        <div class="option">
            ONLY ME
        </div>
    </a>
</div>

<div>
    ARTISTS ROOM
    <a href="#">
        <div class="option">
            PUBLIC ROOM
        </div>
    </a>
    <a href="#">
        <div class="option">
            WITH FRIENDS
        </div>
    </a>
    <a href="php/getArtistsInfo.php">
        <div class="option">
            ONLY ME
        </div>
    </a>
</div>

</body>
</html>