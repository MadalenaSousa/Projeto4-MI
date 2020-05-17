<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

$playlistName = $_POST['playlistname'];
$newPlaylist = $api->createPlaylist([
    'name' => $playlistName
]);

$songTotal = $_POST['songTotal'];

for($i = 0; $i < $songTotal; $i++) {
    $api->addPlaylistTracks($newPlaylist->id, [
        $_POST['songId' . $i]
    ]);
}

header('Location: ../confirm-playlist-creation.php');