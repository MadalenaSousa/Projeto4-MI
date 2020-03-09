<?php

require '../vendor/autoload.php';

session_start();

$api = $_SESSION['api_obj'];
$playlistId = $_GET['id'];

$playlists = $api->getPlaylist($playlistId);

$preUserPlaylistTracks = array();
$trackIds = array();
$trackFeatures = array();
$specificTracksFile = "specificPlaylistTracks.json";
$specificFeaturesFile = "specificTrackFeatures.json";

$tracks = $api->getPlaylistTracks($playlists->id);

foreach ($tracks->items as $track) {
    $track = $track->track;

    array_push($preUserPlaylistTracks, $track);
    array_push($trackIds, $track->id);
}

$trackFeatures = $api->getAudioFeatures($trackIds);

$userPlaylistTracks = json_encode($preUserPlaylistTracks);
$userTrackFeatures = json_encode($trackFeatures);

file_put_contents($specificTracksFile, $userPlaylistTracks);
file_put_contents($specificFeaturesFile, $userTrackFeatures);

header('Location: ../playlist_tracks.php');