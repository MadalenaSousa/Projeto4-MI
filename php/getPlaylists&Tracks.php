<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados das playlists do utilizador loggado

$playlists = $api->getUserPlaylists($user->id, ['limit' => 2]);
$playlistsFile = "userPlaylist.json";
$userPlaylists = json_encode($playlists);

file_put_contents($playlistsFile, $userPlaylists);

//Guardar dados dos tracks das playlists do utilizador loggado

$preUserPlaylistTracks = array();
$trackIds = array();
$trackFeatures = array();
$tracksFile = "userPlaylistTracks.json";
$featuresFile = "userTrackFeatures.json";

foreach ($playlists->items as $playlist) {
    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);
    foreach ($tracks->items as $track) {
        $track = $track->track;
        array_push($preUserPlaylistTracks, $track);
        array_push($trackIds, $track->id);
    }
    $trackFeatures = $api->getAudioFeatures($trackIds);
}

$userPlaylistTracks = json_encode($preUserPlaylistTracks);
$userTrackFeatures = json_encode($trackFeatures);
file_put_contents($tracksFile, $userPlaylistTracks);
file_put_contents($featuresFile, $userTrackFeatures);

if($_GET['data'] == 0) {
    header('Location: ../all_playlists.php');
} else if($_GET['data'] == 1) {
    header('Location: ../playlist_tracks.php');
}
