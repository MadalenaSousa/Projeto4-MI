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
        <div  class="list-people unit">
        </div>
        <div>
            <div class="menu-option unit">MY PLAYLIST SONGS</div>
            <div class="menu-option unit">MY TOP SONGS</div>
            Choose a song to add to the artboard
            <div class="list-songs unit">
            </div>
            <div class="menu-option unit">GENERATE PLAYLIST</div>
            <div class="menu-option unit share-button">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

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
        <div class="menu-option download">
            <div><img src="icons/download.png"></div>
            <div>Download</div>
        </div>
    </div>
</div>

<div class="create-playlist hide">
    <div class="close-create">X</div>
    <div class="unit">
        <h2><b>Create a Playlist!</b></h2>
        Here is an overview of the playlist you can create! Choose a name, a cover image and select the songs you want, after just click the create button and VOI LÁ!
    </div>
    <div class="unit">
        <form method="post" action="php/createPlaylist.php">
            <div class="create-unit">
                <div><label><input placeholder="Playlist Name" type="text" name="playlistname" required></label></div>
                <div class="added-songs-list">
                    <div></div>
                </div>
            </div>
            <div class="create-unit">
                <div>
                    Do you want to use this photo as playlist cover image? <br>
                </div>
                <div class="preview">
                </div>
                <div>
                    <label>Yes<input type="radio" name="cover" value="use"></label>
                    <label>No<input type="radio" name="cover" value="dontuse"></label>
                </div>
            </div>
            <div class="create-unit">
                <div><input type="submit" value="CREATE"></div>
                <div class="close-create"><input type="button" name="cancel" onClick="window.location='tracks.php'" value="CANCEL"></div>
            </div>
        </form>
    </div>
</div>

<script src="js/tracks-solo.js"></script>
</body>
</html>

