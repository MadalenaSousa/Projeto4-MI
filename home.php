<?php
include_once "php/get_data.php";

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
<div>
    <?php
        $api = $_SESSION['api_obj'];
        $userData = $api->me();

        $file = 'data.txt';
        //$data = json_encode($userData);
        $data = "olaola";

        file_put_contents($file, $data, FILE_APPEND);

        $playlists = $api->getUserPlaylists($userData->{'id'}, ['limit' => 2]);

        foreach ($playlists->items as $playlist) {
            echo '<div class="playlist">';
            echo '<div><b>' . htmlspecialchars($playlist->name) . '</b></div>';

            $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);

            foreach ($tracks->items as $track) {
                $track = $track->track;
                echo '<div>' . $track->name . '</div>';

                $features = getTrackAudioFeatures($api, $track->id)->{'audio_features'}[0];
                echo '<div>Duration: <span class="duration">' . $features->duration_ms . '</span></div>';
                echo '<div>URI: <span class="uri">' . $features->uri . '</span></div>';
            }

            echo '</div>';
        }
    ?>
</div>

<a href="second.php" style="text-decoration: none">
    <div class="button">
        NEXT
    </div>
</a>

<script src="js/sketch.js"></script>
</body>
</html>