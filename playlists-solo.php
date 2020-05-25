<?php
session_start();
$session_value = (isset($_SESSION['userData'])) ? $_SESSION['userData'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualizer | Playlists</title>

    <link rel="stylesheet" type="text/css" href="css/style.css">

    <link rel="icon" href="imagens/separador.png" type="image/png" sizes="16x16">

    <script type="text/javascript">
        var userid = '<?php echo $session_value;?>';
    </script>

    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.sound.js"></script>

    <script src="https://cdn.deepstream.io/js/client/latest/ds.min.js"></script>
</head>
<body>

<div class="home-button"><a href="homepage.php">BACK TO HOMEPAGE</a></div>

<div class="informacao">
    <img class="info" src="imagens/Info.png" width="834" height="834" alt="info">
    <div class="popup-info">
        <img class="imagem-info" src="imagens/LegendaPlaylist.png" width="2599" height="2600" alt="info">
        <div class="fechar-info fechar-infoP">X</div>
    </div>
</div>

<div class="menu">
    <div class="unit">
        <div class="titulo">MENU</div>
        <div class="leave leavePlaylists">Leave Room</div>
    </div>
    <div>
        You are the only person in the room
        <div class="list-people unit">
        </div>
        <div>
            <div class="menu-option2">MY PLAYLISTS</div>
            Choose a playlist to add to the artboard<br/>
            <div class="list-playlists unit">
            </div>
            <div class="menu-option unit share-button">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

<div class="overlay hide">
</div>

<div class="logout hide">
    <div class="close-logout close-logoutP">X</div>
    <div class="unit">
        <h2><b>Are you sure you want to leave?</b></h2>
        All the songs you added to the artboard will be deleted.
    </div>
    <div class="unit">
        <div class="menu-option back">
            No, go back to artboard
        </div>
        <div class="menu-option confirm-logout">
            Yes, I want to leave
        </div>
    </div>
</div>

<div class="share hide">
    <div class="close-share close-shareP">X</div>
    <div class="unit">
        <h2><b>Share your art!</b></h2>
        You can share the artboard you created in your social networks or download it and use it for anything you want!
    </div>
    <div class="unit">

        <a class="menu-option"
           target="popup"
           onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=http://music-visualizer.duckdns.org:8888','popup','width=600,height=400');">
            <img class="contorno" src="imagens/facebook.png" width="100" alt="Facebook">
            <div>Facebook</div>

        </a>

        <a target="popup"
           onclick="window.open('https://twitter.com/intent/tweet?text=Just%20Created%20a%20Draw%20of%20My%20Playlists%20from%20Spotify!%0D%0ACheck%20out%20&url=http://music-visualizer.duckdns.org:8888','popup','width=600,height=400');">
            <div class="menu-option">
                <img class="contorno" src="imagens/twitter.png" width="100" alt="Twitter">
                <div>Twitter</div>
            </div>
        </a>

        <div class="menu-option download">
            <div class="preview"></div>
            <div>Download</div>
        </div>
    </div>
</div>
<script src="js/playlists-solo.js"></script>
</body>
</html>
