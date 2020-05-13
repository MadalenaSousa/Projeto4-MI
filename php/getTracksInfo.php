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
$songbarsduration = array();
$songbeatsduration = array();
$songtatumsduration = array();

foreach ($songs->items as $track) {
    array_push($trackIds, $track->id);
    $trackAnalysis = $api->getAudioAnalysis($track->id);

    $barsduration = 0;
    $beatsduration = 0;
    $tatumsduration = 0;
    for($i = 0; $i < count($trackAnalysis->bars); $i++){
        $barsduration = $barsduration + $trackAnalysis->bars[$i]->duration;
    }

    for($i = 0; $i < count($trackAnalysis->beats); $i++){
        $beatsduration = $beatsduration + $trackAnalysis->beats[$i]->duration;
    }

    for($i = 0; $i < count($trackAnalysis->tatums); $i++){
        $tatumsduration = $tatumsduration + $trackAnalysis->tatums[$i]->duration;
    }

    array_push($songbarsduration, $barsduration);
    array_push($songbeatsduration, $beatsduration);
    array_push($songtatumsduration, $tatumsduration);
}

$z = -1;
foreach ($songs->items as $song) {
    $z++;

    $trackFeatures = $api->getAudioFeatures($trackIds)->audio_features;
    $trackAnalysis = $api->getAudioAnalysis($song->id);

    $sectionDuration = array();
    $sectionLoudness = array();
    $sectionTempo = array();
    for($i = 0; $i < count($trackAnalysis->sections); $i++) {
       array_push($sectionDuration, $trackAnalysis->sections[$i]->duration);
       array_push($sectionLoudness, $trackAnalysis->sections[$i]->loudness);
       array_push($sectionTempo, $trackAnalysis->sections[$i]->tempo);
    }

    $singleTopSong = array(
        "audio_analysis" => array(
            "sections" => array(
                "total" => count($trackAnalysis->sections),
                "durations" => $sectionDuration,
                "loudness" => $sectionLoudness,
                "tempo" => $sectionTempo
            ),
            "bars" => array(
                "total" => count($trackAnalysis->bars),
                "average_duration" => $songbarsduration[$z]/count($trackAnalysis->bars)
            ),
            "beats" => array(
                "total" => count($trackAnalysis->beats),
                "average_duration" => $songbeatsduration[$z]/count($trackAnalysis->beats)
            ),
            "tatums" => array(
                "total" => count($trackAnalysis->tatums),
                "average_duration" => $songtatumsduration[$z]/count($trackAnalysis->tatums)
            ),
            "segments" => array(
                "total" => count($trackAnalysis->segments),
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
        "duration" => $song->duration_ms/1000,
        "mode" => $trackAnalysis->track->mode,
        "type" => $trackAnalysis->track->key
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