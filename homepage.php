<?php
session_start();
$session_value = (isset($_SESSION['userData'])) ? $_SESSION['userData'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualizer | Home</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">

    <link rel="icon" href="imagens/separador.png" type="image/png" sizes="16x16">

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
        <div><img src="imagens/playlist-room.png"></div>
        <a href="php/getPlaylistsInfo.php?type=public">
            <div class="option playlist-room">
                PUBLIC ROOM
            </div>
        </a>
        <!--a href="php/getPlaylistsInfo.php?type=friends">
            <div class="option playlist-room">
                WITH FRIENDS
            </div>
        </a-->
        <a href="php/getPlaylistsInfo.php?type=solo">
            <div class="option playlist-room">
                ONLY ME
            </div>
        </a>
    </div>

    <div class="category">
        <div class="titulo unit">SONGS ROOM</div>
        <div><img src="imagens/songs-room.png"></div>
        <a href="php/getTracksInfo.php?type=public">
            <div class="option song-room">
                PUBLIC ROOM
            </div>
        </a>
        <!--a href="php/getTracksInfo.php?type=friends">
            <div class="option song-room">
                WITH FRIENDS
            </div>
        </a-->
        <a href="php/getTracksInfo.php?type=solo">
            <div class="option song-room">
                ONLY ME
            </div>
        </a>
    </div>

    <div class="category">
        <div class="titulo unit">ARTISTS ROOM</div>
        <div><img src="imagens/artist-room.png"></div>
        <a href="php/getArtistsInfo.php?type=public">
            <div class="option artist-room">
                PUBLIC ROOM
            </div>
        </a>
        <!--a href="php/getArtistsInfo.php?type=friends">
            <div class="option artist-room">
                WITH FRIENDS
            </div>
        </a-->
        <a href="php/getArtistsInfo.php?type=solo">
            <div class="option artist-room">
                ONLY ME
            </div>
        </a>
    </div>
</div>
<script src="js/login.js"></script>
</body>
</html>