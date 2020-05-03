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
        People in the Room
        <div class="list-people unit">
        </div>
        <div>
            Choose a playlist to add to the artboard
            <div class="menu-option unit">MY PLAYLISTS</div>
            <div class="list-playlists unit">
            </div>
            <div class="menu-option unit share-button">SAVE ART AND SHARE</div>
        </div>
    </div>
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
        <div class="menu-option">
            <div><img src="icons/facebook.png"></div>
            <div>Facebook</div>
        </div>
        <div class="menu-option">
            <div><img src="icons/instagram.png"></div>
            <div>Instagram</div>
        </div>
        <div class="menu-option">
            <div><img src="icons/twitter.png"></div>
            <div>Twitter</div>
        </div>
        <div class="menu-option">
            <div><img src="icons/download.png"></div>
            <div>Download</div>
        </div>
    </div>
</div>
<script src="js/playlists.js"></script>
</body>
</html>
