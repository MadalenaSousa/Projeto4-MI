<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados dos top artistas do utilizador loggado

$TopArtists = $api->getmytop("artists");
$TopArtistsFile= "userTopArtists.json";
$userTopArtists = json_encode($TopArtists);

file_put_contents($TopArtistsFile, $userTopArtists);

header('Location: ../artists.php');