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


$ArrayTopArtistsAlbums= array();
$ArrayTopArtistsAlbumsTracks = array();
$TopArtistsAlbumsFile= "TopArtistsAlbums.json";
$TopArtistsAlbumsTracksFile = "TopArtistsAlbumsTracks.json";

$trackTopTracksAudioFeatures = array();
$featuresFile = "TopTracksAudioFeatures.json";
$arrayDeIds=array();
/*
foreach ($TopArtists->items as $artist) {
    $TopArtistsAlbums = $api->getArtistAlbums($artist->id, ['limit' => 5]);

    foreach ($TopArtistsAlbums->items as $album) {
        $albumid = $album->id;
        $AlbumTracks = $api->getAlbumTracks($albumid);
        array_push($ArrayTopArtistsAlbums, $TopArtistsAlbums);
        array_push($ArrayTopArtistsAlbumsTracks, $AlbumTracks);

        foreach ($AlbumTracks->items as $track) {
            $trackid = $track->id;

        }
    }
    $trackFeaturesTopTracks = $api->getAudioFeatures($trackid);
    array_push($trackTopTracksAudioFeatures, $trackFeaturesTopTracks);
}
*/$arrayid=array();

foreach ($TopArtists->items as $artist) {
    $TopArtistsAlbums = $api->getArtistAlbums($artist->id, ['limit' => 5]);
    foreach ($TopArtistsAlbums->items as $album) {
        $albumid = $album->id;
        $AlbumTracks = $api->getAlbumTracks($albumid);
        array_push($ArrayTopArtistsAlbums, $TopArtistsAlbums);
        array_push($ArrayTopArtistsAlbumsTracks, $AlbumTracks);
        foreach ($AlbumTracks->items as $track) {
            array_push($arrayid, $track->id);
        }
    }
}
$trackFeaturesTopTracks = $api->getAudioFeatures($arrayid);
array_push($trackTopTracksAudioFeatures, $trackFeaturesTopTracks);


$TAT = json_encode($ArrayTopArtistsAlbums);
$TATF = json_encode($ArrayTopArtistsAlbumsTracks);
file_put_contents($TopArtistsAlbumsFile, $TAT);
file_put_contents($TopArtistsAlbumsTracksFile, $TATF);



$userTrackFeatures = json_encode($trackTopTracksAudioFeatures);
file_put_contents($featuresFile, $userTrackFeatures);


header('Location: ../artists.php');