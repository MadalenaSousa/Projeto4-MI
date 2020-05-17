<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

$songId = $_GET['id'];

$api->addMyTracks([
    $songId
]);

header('Location: ../tracks.php');