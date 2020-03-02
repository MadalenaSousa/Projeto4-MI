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
<body>

<a href="" style="text-decoration: none">
    <div class="button">
        NEXT
    </div>
</a>

<!--script src="https://sdk.scdn.co/spotify-player.js"></script>
<script>
    let sessionToken = <?//php echo $_SESSION['api_obj']?>;

    handleScriptLoad = () => {
        return new Promise(resolve => {
            if (window.Spotify) {
                resolve();
            } else {
                window.onSpotifyWebPlaybackSDKReady = resolve;
            }
        });
    };

    handleScriptLoad();

    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = sessionToken;
        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
    };
</script-->
<script src="js/duration.js"></script>
</body>
</html>
