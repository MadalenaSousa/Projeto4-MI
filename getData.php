<?php
require 'vendor/autoload.php';

function getTracks($api, $albumId) { //Vai buscar todos os tracks num album
    $tracks = $api->getAlbumTracks($albumId);

    foreach ($tracks->items as $track) {
        echo '<b>' . $track->name . '</b> <br>';
    }
}

function getTrackAudioFeatures($api, $trackId){ //Vai buscar todas as features de um Track
    $analysis = $api->getAudioFeatures($trackId);

    return $analysis;
}

function listUserPlaylists($api, $userId) { //Lista todas as playlists de um utilizador
    $playlists = $api->getUserPlaylists($userId);

    foreach ($playlists->items as $playlist) {
        echo '<a href="' . $playlist->external_urls->spotify . '">' . htmlspecialchars($playlist->name) . '</a> <br>';
    }
}