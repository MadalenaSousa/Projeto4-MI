<?php
include_once "getData.php";

session_start()

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
<?php
    $api = $_SESSION['api_obj'];
    $userData = $api->me();

    $playlists = $api->getUserPlaylists($userData->{'id'}, ['limit' => 2]);

    foreach ($playlists->items as $playlist) {
        echo '<div>' . htmlspecialchars($playlist->name) . $playlist->id . '</div>';

        $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);

        foreach ($tracks->items as $track) {
            $track = $track->track;
            echo '<div>' . $track->name . $track->id . '</div>';

            $features = getTrackAudioFeatures($api, $track->id)->{'audio_features'}[0];
            echo '<div>Danceability: <span class="danceability">' . $features->danceability . '</span></div>';
        }
    }

?>

<script src="js/sketch.js"></script>
</body>
</html>