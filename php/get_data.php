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
$tracksFile = "userPlaylistTracks.json";

foreach ($playlists->items as $playlist) {
    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);

    foreach ($tracks->items as $track) {
        $track = $track->track;
        array_push($preUserPlaylistTracks, $track);
    }
}

$userPlaylistTracks = json_encode($preUserPlaylistTracks);
file_put_contents($tracksFile, $userPlaylistTracks);

header('Location: ../options.php');