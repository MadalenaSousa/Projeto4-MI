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

$playlists = $api->getUserPlaylists($user->{'id'}, ['limit' => 2]);
$playlistsFile = "userPlaylist.json";
$userPlaylists = json_encode($playlists);

file_put_contents($playlistsFile, $userPlaylists);

//Guardar dados dos tracks das playlists do utilizador loggado

$preUserPlaylistTracks = array();
$trackAudioFeatures = array();
$tracksFile = "userPlaylistTracks.json";
$featuresFile = "userTrackFeatures.json";

foreach ($playlists->items as $playlist) {
    $tracks = $api->getPlaylistTracks($playlist->id, ['limit' => 5]);

    foreach ($tracks->items as $track) {
        $track = $track->track;
        $trackFeatures = $api->getAudioFeatures($track->id);
        array_push($preUserPlaylistTracks, $track);
        array_push($trackAudioFeatures, $trackFeatures);
    }
}

$userPlaylistTracks = json_encode($preUserPlaylistTracks);
$userTrackFeatures = json_encode($trackAudioFeatures);
file_put_contents($tracksFile, $userPlaylistTracks);
file_put_contents($featuresFile, $userTrackFeatures);

$TopArtists = $api->getmytop("artists");
$TopArtistsFile= "userTopArtists.json";
$userTopArtistss = json_encode($TopArtists);
file_put_contents($TopArtistsFile, $userTopArtistss);

/*

$ArtistsTracks= $api->getartisttoptracks($TopArtists->items > "id","ISO 3166-2:PT",['limit' => 5]);
$ArtistsTopTracksFile= "ArtistsTopTracks.json";
$top = json_encode($ArtistsTracks);
file_put_contents($ArtistsTopTracksFile, $top);*/



$ArrayTopArtistsAlbums= array();
$ArrayTopArtistsAlbumsTracks = array();
$TopArtistsAlbumsFile= "TopArtistsAlbums.json";
$TopArtistsAlbumsTracksFile = "TopArtistsAlbumsTracks.json";

$trackTopTracksAudioFeatures = array();
$featuresFile = "TopTracksAudioFeatures.json";


foreach ($TopArtists->items as $artist) {
    $TopArtistsAlbums = $api->getArtistAlbums($artist->id, ['limit' => 5]);
    foreach ($TopArtistsAlbums->items as $album) {
        $albumid = $album->id;
        $AlbumTracks = $api->getAlbumTracks($albumid);
        array_push($ArrayTopArtistsAlbums, $TopArtistsAlbums);
        array_push($ArrayTopArtistsAlbumsTracks, $AlbumTracks);
        foreach ($AlbumTracks->items as $track) {
            $trackid = $track->id;
            $trackFeaturesTopTracks = $api->getAudioFeatures($trackid);
            array_push($trackTopTracksAudioFeatures, $trackFeaturesTopTracks);
        }
    }

}

$TAT = json_encode($ArrayTopArtistsAlbums);
$TATF = json_encode($ArrayTopArtistsAlbumsTracks);
file_put_contents($TopArtistsAlbumsFile, $TAT);
file_put_contents($TopArtistsAlbumsTracksFile, $TATF);



$userTrackFeatures = json_encode($trackTopTracksAudioFeatures);
file_put_contents($featuresFile, $userTrackFeatures);


/*
$ArrayTopTracks= array();
$trackAudioFeatures2 = array();
$ArtistsTopTracksFile= "ArtistsTopTracks.json";
$TopTracksfeaturesFile = "TopArtistTrackFeatures.json";

$country="ISO 3166-2:PT";
foreach ($TopArtists->items as $artist) {
    $tracksArtisttop = $api->getArtistTopTracks($artist->id, $country);
   // array_push($Array, $tracksArtisttop);
    foreach ($tracksArtisttop->items as $track) {
        $track = $track->track;
        $trackFeatures = $api->getAudioFeatures($track->id);
        array_push($ArrayTopTracks, $track);
        array_push($trackAudioFeatures2, $trackFeatures);
    }

}

$TAT = json_encode($ArrayTopTracks);
$TATF = json_encode($trackAudioFeatures2);
file_put_contents($ArtistsTopTracksFile, $TAT);
file_put_contents($TopTracksfeaturesFile, $TATF);

*/


header('Location: ../options.php');