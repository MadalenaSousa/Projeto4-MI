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
$trackFeaturesTopTracks = array();
$featuresFile = "TopTracksAudioFeatures.json";
$arrayDeIds=array();

foreach ($TopArtists->items as $artist) {
    $TopArtistsAlbums = $api->getArtistAlbums($artist->id, ['limit' => 5]);
    array_push($ArrayTopArtistsAlbums, $TopArtistsAlbums);

    foreach ($TopArtistsAlbums->items as $album) {
        $AlbumTracks = $api->getAlbumTracks($album->id);
        array_push($ArrayTopArtistsAlbumsTracks, $AlbumTracks);
        foreach ($AlbumTracks->items as $track) {
            array_push($arrayDeIds,$track->id);
            $trackFeaturesTopTracks = $api->getAudioFeatures($arrayDeIds);
        }
    }

}
$userTrackFeatures = json_encode($trackFeaturesTopTracks);
file_put_contents($featuresFile, $userTrackFeatures);


$TAT = json_encode($ArrayTopArtistsAlbums);
$TATF = json_encode($ArrayTopArtistsAlbumsTracks);
file_put_contents($TopArtistsAlbumsFile, $TAT);
file_put_contents($TopArtistsAlbumsTracksFile, $TATF);





header('Location: ../artists.php');