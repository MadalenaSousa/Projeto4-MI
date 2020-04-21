<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados dos top artistas do utilizador loggado

$artists = $api->getMyTop("artists", ['limit' => 10]);
$artistsFile = "artists-object.json";
$artistObject = array();
$trackIds = array();

foreach ($artists->items as $artist) {
    $danceability = 0;
    $energy = 0;
    $loudness = 0;
    $positivity = 0;
    $speed = 0;

    $tracks = $api->getArtistTopTracks($artist->id, ['country' => 'PT'], ['limit' => 10],  ['time_range' => 'short_term']);

    foreach ($tracks->tracks as $track) {
        array_push($trackIds, $track->id);
    }

    $artistTrackFeatures = $api->getAudioFeatures($trackIds)->audio_features;

    for($i = 0; $i < count($artistTrackFeatures); $i++){
        $danceability = $danceability + $artistTrackFeatures[$i]->danceability;
        $energy = $energy + $artistTrackFeatures[$i]->energy;
        $loudness = $loudness + $artistTrackFeatures[$i]->loudness;
        $positivity = $positivity + $artistTrackFeatures[$i]->valence;
        $speed = $speed + $artistTrackFeatures[$i]->tempo;
    }

    $singleArtist = array(
        "name" => $artist->name,
        "id" => $artist->id,
        "popularity" => $artist->popularity,
        "genres" => $artist->genres,
        "photo" => $artist->images[0],
        "followers" => $artist->followers,
        "top_tracks_average_features" => array(
            "danceability" => $danceability/count($artistTrackFeatures),
            "energy" => $energy/count($artistTrackFeatures),
            "loudness" => $loudness/count($artistTrackFeatures),
            "positivity" => $positivity/count($artistTrackFeatures),
            "speed" => $speed/count($artistTrackFeatures)
        )
    );

    array_push($artistObject, $singleArtist);
}

$artistData = json_encode($artistObject);
file_put_contents($artistsFile, $artistData);

header('Location: ../artists.php');

