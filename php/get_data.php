<?php
require '../vendor/autoload.php';

session_start();

//Guardar API do utilizadr loggado na sessão

$api = $_SESSION['api_obj'];

//Guardar dados do utilizador loggado

$user = $api->me();
$userFile = "user.json";
$userData = json_encode($user);

file_put_contents($userFile, $userData);

//Guardar dados das playlists do utilizador loggado

$playlists = $api->getUserPlaylists($userData->{'id'}, ['limit' => 2]);
$playlistsFile = "userPlaylist.json";
$userPlaylists = json_encode($playlists);

file_put_contents($playlistsFile, $userPlaylists);

//Guardar dados dos tracks das playlists do utilizador loggado

$preUserPlaylistTracks = array();
$trackAudioFeatures = array();
$tracksFile = "userPlaylistTracks.json";
$featuresFile = "userTrackFeatures.json";

foreach ($playlists->items as $playlist) {
    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);

    foreach ($tracks->items as $track) {
        $track = $track->track;
        $trackFeatures = $api->getAudioFeatures($track->id);
        array_push($preUserPlaylistTracks, $track);
        array_push($trackAudioFeatures, $trackFeatures);
    }
}

$userPlaylistTracks = json_encode($preUserPlaylistTracks);
$userTrackFeatures = json_encode($trackAudioFeatures);
file_put_contents($tracksFile, $userPlaylistTracks);
file_put_contents($featuresFile, $userTrackFeatures);

$TopArtists = $api->getmytop("artists");
$TopArtistsFile= "userTopArtists.json";
$userTopArtistss = json_encode($TopArtists);
file_put_contents($TopArtistsFile, $userTopArtistss);

header('Location: ../options.php');