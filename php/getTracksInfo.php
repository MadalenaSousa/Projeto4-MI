<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados das músicas do utilizador loggado

$playlistsSongsFile = "playlist-songs-object.json";
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

        if ($user->id == $playlist->owner->id) {
            $singlePlaylistSong = array(
                "name" => $playlist->name,
                "id" => $playlist->id,
                "songs" => array(
                    "audio_analysis" => array(
                        "bars" => $trackAnalysis->bars,
                        "beats" => $trackAnalysis->beats,
                        "segments" => $trackAnalysis->segments,
                        "tatums" => $trackAnalysis->tatums
                    ),
                    "audio_features" => array(
                        "danceability" => $trackFeatures[$i]->danceability,
                        "energy" => $trackFeatures[$i]->danceability,
                        "loudness" => $trackFeatures[$i]->danceability,
                        "positivity" => $trackFeatures[$i]->danceability,
                        "speed" => $trackFeatures[$i]->danceability
                    ),
                    "id" => $track->id,
                    "name" => $track->name,
                    "artists" => $track->artists,
                    "album" => $track->album->name,
                    "popularity" => $track->popularity,
                    "preview_url" => $track->preview_url
                )
            );

            array_push($playlistsSongObject, $singlePlaylistSong);
        }
    }
}

$playlistSongsData = json_encode($playlistsSongObject);
file_put_contents($playlistsSongsFile, $playlistSongsData);

$topSongsFile = "top-songs-object.json";
$songs = $api->getMyTop("tracks", ['limit' => 10]);
$topSongObject = array();
$trackIds = array();

foreach ($songs->items as $track) {
    array_push($trackIds, $track->id);
}

$i = -1;
foreach ($songs->items as $song) {
    $i++;

    $trackFeatures = $api->getAudioFeatures($trackIds)->audio_features;
    $trackAnalysis = $api->getAudioAnalysis($song->id);

    $singleTopSong = array(
        "audio_analysis" => array(
            "bars" => $trackAnalysis->bars,
            "beats" => $trackAnalysis->beats,
            "segments" => $trackAnalysis->segments,
            "tatums" => $trackAnalysis->tatums
        ),
        "audio_features" => array(
            "danceability" => $trackFeatures[$i]->danceability,
            "energy" => $trackFeatures[$i]->danceability,
            "loudness" => $trackFeatures[$i]->danceability,
            "positivity" => $trackFeatures[$i]->danceability,
            "speed" => $trackFeatures[$i]->danceability
        ),
        "id" => $song->id,
        "name" => $song->name,
        "artists" => $song->artists,
        "album" => $song->album->name,
        "popularity" => $song->popularity,
        "preview_url" => $song->preview_url
    );

    array_push($topSongObject, $singleTopSong);
}

$topSongData = json_encode($topSongObject);
file_put_contents($topSongsFile, $topSongData);

header('Location: ../tracks.php');