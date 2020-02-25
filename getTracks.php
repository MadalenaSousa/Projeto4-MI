<?php
require 'vendor/autoload.php';

function getTracks($api) {
    $tracks = $api->getAlbumTracks('3oIFxDIo2fwuk4lwCmFZCx');

    foreach ($tracks->items as $track) {
        echo '<b>' . $track->name . '</b> <br>';
    }
}