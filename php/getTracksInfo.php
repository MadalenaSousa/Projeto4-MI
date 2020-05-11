<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados das músicas do utilizador loggado

$topSongsFile = $user->id . "-top-songs-object.json";
$songs = $api->getMyTop("tracks", ['limit' => 10]);
$topSongObject = array();
$trackIds = array();

foreach ($songs->items as $track) {
    array_push($trackIds, $track->id);
}

$z = -1;
foreach ($songs->items as $song) {
    $z++;

    $trackFeatures = $api->getAudioFeatures($trackIds)->audio_features;
    $trackAnalysis = $api->getAudioAnalysis($song->id);

    $singleTopSong = array(
        "audio_analysis" => array(
            "bars" => array(
                "total" => count($trackAnalysis->bars),
                "average_duration" => ""
            ),
            "beats" => array(
                "total" => count($trackAnalysis->beats),
                "average_duration" => ""
            ),
            "segments" => array(
                "total" => count($trackAnalysis->segments),
                "average_duration" => ""
            ),
            "tatums" => array(
                "total" => count($trackAnalysis->tatums),
                "average_duration" => ""
            ),
        ),
        "audio_features" => array(
            "danceability" => $trackFeatures[$z]->danceability,
            "energy" => $trackFeatures[$z]->energy,
            "loudness" => $trackFeatures[$z]->loudness,
            "positivity" => $trackFeatures[$z]->valence,
            "speed" => $trackFeatures[$z]->tempo
        ),
        "id" => $song->id,
        "name" => $song->name,
        "artists" => $song->artists[0]->name,
        "album" => $song->album->name,
        "popularity" => $song->popularity,
        "preview_url" => $song->preview_url,
        "duration" => $track->duration_ms/1000
    );

    array_push($topSongObject, $singleTopSong);
}

$topSongData = json_encode($topSongObject);
file_put_contents($topSongsFile, $topSongData);

/*
$playlistsSongsFile = $user->id . "-playlist-songs-object.json";
$playlists = $api->getUserPlaylists($user->id, ['limit' => 10]);
$playlistsSongObject = array();
$trackIds = array();

foreach ($playlists->items as $playlist) {
    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 10]);

    foreach ($tracks->items as $track) {
        $track = $track->track;
        array_push($trackIds, $track->id);
    }

    $trackFeatures = $api->getAudioFeatures($trackIds)->audio_features;

    $i = -1;
    foreach ($tracks->items as $track) {
        $i++;
        $track = $track->track;

        $trackAnalysis = $api->getAudioAnalysis($track->id);
        $genres = $api->getArtist($track->artists[0]->id)->genres;

        if ($user->id == $playlist->owner->id) {
            $singlePlaylistSong = array(
                "name" => $playlist->name,
                "id" => $playlist->id,
                "songs" => array(
                    "audio_analysis" => array(
                        "bars" => array(
                            "total" => count($trackAnalysis->bars),
                            "average_duration" => ""
                        ),
                        "beats" => array(
                            "total" => count($trackAnalysis->beats),
                            "average_duration" => ""
                        ),
                        "segments" => array(
                            "total" => count($trackAnalysis->segments),
                            "average_duration" => ""
                        ),
                        "tatums" => array(
                            "total" => count($trackAnalysis->tatums),
                            "average_duration" => ""
                        ),
                    ),
                    "audio_features" => array(
                        "danceability" => $trackFeatures[$z]->danceability,
                        "energy" => $trackFeatures[$z]->energy,
                        "loudness" => $trackFeatures[$z]->loudness,
                        "positivity" => $trackFeatures[$z]->valence,
                        "speed" => $trackFeatures[$z]->tempo
                    ),
                    "id" => $track->id,
                    "name" => $track->name,
                    "artists" => $track->artists[0]->name,
                    "album" => $track->album->name,
                    "genres" => $genres,
                    "popularity" => $track->popularity,
                    "preview_url" => $track->preview_url,
                    "duration" => $track->duration_ms/1000
                )
            );

            array_push($playlistsSongObject, $singlePlaylistSong);
        }
    }
}

$playlistSongsData = json_encode($playlistsSongObject);
file_put_contents($playlistsSongsFile, $playlistSongsData);*/

if($_GET['type'] == 'public') {
    header('Location: ../tracks.php');
} else if($_GET['type'] == 'solo'){
    header('Location: ../tracks-solo.php');
} else {
    echo 'PAGE NOT AVAILABLE';
}