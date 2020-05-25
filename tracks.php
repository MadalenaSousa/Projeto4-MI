<?php
session_start();
$session_value = (isset($_SESSION['userData'])) ? $_SESSION['userData'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Music Taste Visualizer</title>

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

<div class="overlay hide">
</div>

<div class="home-button">BACK TO HOMEPAGE</div>

<div class="informacao">
    <img class="info" src="imagens/Info.png" width="834" height="834" alt="info">
    <div class="popup-info">
        <img class="imagem-info" src="imagens/LegendaSongs.png" width="2602" height="2599" alt="info">
        <div class="fechar-info fechar-infoS">X</div>
    </div>

</div>

<div class="menu">
    <div class="unit">
        <div class="titulo">MENU</div>
        <div class="leave leaveSongs">Leave Room</div>
    </div>
    <div>
        People in Music Taste Visualizer
        <div  class="list-people unit">
        </div>
        <div>
            <!--div class="menu-option unit from-playlist">MY PLAYLIST SONGS</div-->
            <div class="menu-option2">MY TOP SONGS</div>
            Choose a song to add to the artboard <br/>
            <div class="list-songs unit">
            </div>
            <div class="menu-option unit create-button">GENERATE PLAYLIST</div>
            <div class="menu-option unit share-button">SAVE ART AND SHARE</div>
        </div>
    </div>
</div>

<div class="logout hide">
    <div class="close-logout close-logoutS">X</div>
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
    <div class="close-share close-shareS">X</div>
    <div class="unit">
        <h2><b>Share your art!</b></h2>
        You can share the artboard you created in your social networks or download it and use it for anything you want!
    </div>
    <div class="unit">

        <a target="popup"
           onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=http://music-visualizer.duckdns.org:8888/','popup','width=600,height=400');">
            <div class="menu-option">
                <img class="contorno" src="imagens/facebook.png" width="100" alt="Facebook">
                <div>Facebook</div>
            </div>
        </a>

        <!--div class="menu-option">
            <div><img src="imagens/instagram.png"></div>
            <div>Instagram</div>
        </div-->

        <a target="popup"
           onclick="window.open('https://twitter.com/intent/tweet?text=Just%20Created%20a%20Garden%20of%20My%20Songs%20from%20Spotify!%0D%0ACheck%20out%20&url=http://music-visualizer.duckdns.org:8888','popup','width=600,height=400');">
            <div class="menu-option">
                <img class="contorno" src="imagens/twitter.png" width="100" alt="Twitter">
                <div>Twitter</div>
            </div>
        </a>

        <div class="menu-option download">
            <!--img src="imagens/download.png"-->
            <div class="preview"></div>
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
    <form method="post" action="php/createPlaylist.php">
        <div class="unit">
            <div class="create-unit">
                <div><label><input placeholder="Insert Playlist Name" type="text" name="playlistname" required></label></div>
                <div class="added-songs-list">
                    <div></div>
                </div>
            </div>
            <div class="create-unit">
                <div>
                    Do you want to use this photo as playlist cover image? <br>
                </div>
                <div class="preview-create">
                </div>
                <div>
                    <label>Yes<input type="radio" name="cover" value="use" required></label>
                    <label>No<input type="radio" name="cover" value="dontuse" required></label>
                </div>
            </div>
        </div>
        <div class="unit create-buttons">
            <input type="submit" value="CREATE">
            <input class="close-create" type="button" name="cancel" onClick="window.location='tracks.php'" value="CANCEL">
        </div>
    </form>
</div>

<div class="logout-or-home hide">
    <div class="close-home">X</div>
    <div class="unit">
        <h2><b>Keep Changes?</b></h2>
    </div>
    <div class="unit">
        Do you want to keep the changes you made to the artboard ou do you want to leave the room?
        Keep in mind that, if you are not coming back to the room, you should leave the room and all your songs will be removed from the artboard.
    </div>
    <div class="unit">
        <div class="menu-option delete-changes">LEAVE ROOM</div>
        <div class="menu-option keep-changes">I WILL COME BACK</div>
        <div class="menu-option back-artboard">BACK TO ARTBOARD</div>
    </div>
</div>

<div class="no-url hide">
    <div class="close-url">X</div>
    <div class="unit">
        <h2><b>Sorry!</b></h2>
    </div>
    <div class="unit">
        Looks like Spotify doesn't have a preview of this Song or it's currently unvailable.
        Please try another song. <br>
        Thank You!
    </div>
</div>

<script src="js/tracks.js"></script>
</body>
</html>
