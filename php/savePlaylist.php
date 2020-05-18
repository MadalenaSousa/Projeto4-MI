<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

$playlistId = $_GET['id'];

$api->followPlaylistForCurrentUser([
    $playlistId
]);

header('Location: ../playlists.php');