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

    <link rel="icon" href="icons/separador.png" type="image/png" sizes="16x16">

    <script type="text/javascript">
        var userid = '<?php echo $session_value;?>';
    </script>

    <script src="p5/p5.js"></script>
    <script src="p5/addons/p5.sound.js"></script>

    <script src="https://cdn.deepstream.io/js/client/latest/ds.min.js"></script>
</head>
<body>

<div class="home-button"><a href="homepage.php">BACK TO HOMEPAGE</a></div>

<div class="menu">
    <div class="unit">
        <div class="titulo">MENU</div>
        <div class="leave">Leave Room</div>
    </div>
    <div>

        You are the only person in the room
        <div class="list-people unit">
        </div>
        <div>
            <div class="menu-option2">MY TOP ARTISTS</div>
            Choose an artist to add to the artboard

            <div class="list-songs unit">
            </div>
            <div class="menu-option unit share-button">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

<div id="lista"></div>

<div class="overlay hide">
</div>

<div class="logout hide">
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
    <div class="close-share">X</div>
    <div class="unit">
        <h2><b>Share your art!</b></h2>
        You can share the artboard you created in your social networks or download it and use it for anything you want!
    </div>
    <div class="unit">

        <a class="menu-option"
           target="popup"
           onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=example.org','popup','width=600,height=400');">


            <div><img src="icons/facebook.png"></div>

            <div>Facebook</div>

        </a>


        <a class="menu-option"
           target="popup"
           onclick="window.open('https://twitter.com/intent/tweet?text=Look%20at%20my%20sea%20of%20my%20Top%20Artists%20on%20Spotify','popup','width=600,height=400');">
            <div><img src="icons/twitter.png"></div>
            <div>Twitter</div>

        </a>

        <div class="menu-option download">

            <img src="icons/download.png">

            <div>Download</div>
        </div>
    </div>
</div>

<script src="js/artists-solo.js"></script>
</body>
</html>

