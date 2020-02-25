<?php
require 'vendor/autoload.php';

function getTracks($api) {
    $tracks = $api->getAlbumTracks('3oIFxDIo2fwuk4lwCmFZCx');

    foreach ($tracks->items as $track) {
        echo '<b>' . $track->name . '</b> <br>';
    }
}

function getTrackAudioFeatures($api){
    $analysis = $api->getAudioFeatures('2p2aCtErYX6UaFxyfpVvWC');

    return $analysis;
}

function listUserPlaylists($api, $userId) {
    $playlists = $api->getUserPlaylists($userId);

    foreach ($playlists->items as $playlist) {
        echo '<a href="' . $playlist->external_urls->spotify . '">' . htmlspecialchars($playlist->name) . '</a> <br>';
    }
}