<?php
session_start();
$session_value = (isset($_SESSION['userData'])) ? $_SESSION['userData'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualiser</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">

    <script type="text/javascript">
        var userid = '<?php echo $session_value;?>';
    </script>

    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.sound.js"></script>
</head>
<body style="background-color: black">

<div class="all-categories">
    <div class="category">
        <div class="titulo unit">PLAYLISTS ROOM</div>
        <div><img src="icons/playlist-room.png"></div>
        <a href="php/getPlaylistsInfo.php">
            <div class="option playlist-room">
                PUBLIC ROOM
            </div>
        </a>
        <a href="#">
            <div class="option playlist-room">
                WITH FRIENDS
            </div>
        </a>
        <a href="php/getPlaylistsInfo.php">
            <div class="option playlist-room">
                ONLY ME
            </div>
        </a>
    </div>

    <div class="category">
        <div class="titulo unit">SONGS ROOM</div>
        <div><img src="icons/song-room.png"></div>
        <a href="php/getTracksInfo.php">
            <div class="option song-room">
                PUBLIC ROOM
            </div>
        </a>
        <a href="#">
            <div class="option song-room">
                WITH FRIENDS
            </div>
        </a>
        <a href="php/getTracksInfo.php">
            <div class="option song-room">
                ONLY ME
            </div>
        </a>
    </div>

    <div class="category">
        <div class="titulo unit">ARTISTS ROOM</div>
        <div><img src="icons/artist-room.png"></div>
        <a href="php/getArtistsInfo.php">
            <div class="option artist-room">
                PUBLIC ROOM
            </div>
        </a>
        <a href="#">
            <div class="option artist-room">
                WITH FRIENDS
            </div>
        </a>
        <a href="php/getArtistsInfo.php">
            <div class="option artist-room">
                ONLY ME
            </div>
        </a>
    </div>
</div>

</body>
</html>