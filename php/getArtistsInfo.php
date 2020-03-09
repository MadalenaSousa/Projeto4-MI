<?php
require '../vendor/autoload.php';

session_start();
$api = $_SESSION['api_obj'];
$user = $api->me();

//Guardar dados dos top artistas do utilizador loggado

$TopArtists = $api->getmytop("artists");
$TopArtistsFile = "userTopArtists.json";
$userTopArtists = json_encode($TopArtists);

file_put_contents($TopArtistsFile, $userTopArtists);


$TopArtistsAlbumsFile = "userTopArtistsAlbums.json";
$ArrayTopArtistsAlbums=array();
foreach ($TopArtists->items as $artist) {
    $TopArtistsAlbums = $api->getArtistAlbums($artist->id);

    foreach ($TopArtistsAlbums->items as $album) {
        array_push($ArrayTopArtistsAlbums, $TopArtistsAlbums);
    }

}
$TAT = json_encode($ArrayTopArtistsAlbums);
file_put_contents($TopArtistsAlbumsFile, $TAT);

header('Location: ../artists.php');