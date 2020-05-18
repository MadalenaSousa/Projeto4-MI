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

$filename = "../imagens/artboard-" . $user->id . ".jpeg";

if($_POST['cover'] == 'use') {
    $file = fopen($filename, "wb");

    $data = explode(',', $_POST['playlistImg']);

    fwrite($file, base64_decode($data[1]));
    fclose($file);

    $imageData = base64_encode(file_get_contents($filename));
    $api->updatePlaylistImage($newPlaylist->id, $imageData);
}

header('Location: ../confirm-playlist-creation.php');