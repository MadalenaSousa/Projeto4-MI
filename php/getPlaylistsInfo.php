<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados das playlists do utilizador loggado

$playlistsFile = "playlist-object.json";
$playlists = $api->getUserPlaylists($user->id, ['limit' => 10]);
$playlistsObject = array();
$trackIds = array();
$genres = array();

foreach ($playlists->items as $playlist) {
    $danceability = 0;
    $energy = 0;
    $loudness = 0;
    $positivity = 0;
    $speed = 0;

    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 10]);

    foreach ($tracks->items as $track) {
        $track = $track->track;
        array_push($trackIds, $track->id);

        $artist = $api->getArtist($track->artists[0]->id);

        for ($i = 0; $i < count($artist->genres); $i++) {
           array_push($genres, $artist->genres[$i]);
        }
    }

    $trackFeatures = $api->getAudioFeatures($trackIds)->audio_features;

    for($i = 0; $i < count($trackFeatures); $i++){
        $danceability = $danceability + $trackFeatures[$i]->danceability;
        $energy = $energy + $trackFeatures[$i]->energy;
        $loudness = $loudness + $trackFeatures[$i]->loudness;
        $positivity = $positivity + $trackFeatures[$i]->valence;
        $speed = $speed + $trackFeatures[$i]->tempo;
    }

    if($user->id == $playlist->owner->id) {
        $singlePlaylist = array(
            "name" => $playlist->name,
            "description" => $playlist->description,
            "id" => $playlist->id,
            "cover" => $playlist->images[0],
            "owner" => array(
                "id" => $playlist->owner->id
            ),
            "genres" => $genres,
            "tracks" => array(
                "total" => $playlist->tracks->total,
                "tracks-link" => $playlist->tracks->href
            ),
            "average_features" => array(
                "danceability" => $danceability/count($trackFeatures),
                "energy" => $energy/count($trackFeatures),
                "loudness" => $loudness/count($trackFeatures),
                "positivity" => $positivity/count($trackFeatures),
                "speed" => $speed/count($trackFeatures)
            )
        );

        array_push($playlistsObject, $singlePlaylist);
    }
}

$playlistData = json_encode($playlistsObject);
file_put_contents($playlistsFile, $playlistData);

header('Location: ../playlists.php');

