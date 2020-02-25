<?php
require 'vendor/autoload.php';
include_once "getTracks.php";

$session = new SpotifyWebAPI\Session(
    'de8b0fa92d7a421da94cd48858522a77',
    'a713fdaaef5347ae801749567d4e82e8',
    'http://localhost/Projeto4-MI/loginSpotify.php'
);

$api = new SpotifyWebAPI\SpotifyWebAPI();

if (isset($_GET['code'])) {
    $session->requestAccessToken($_GET['code']);
    $api->setAccessToken($session->getAccessToken());

    //getTracks($api);

    $features = getTrackAudioFeatures($api)->{'audio_features'}[0];
    print_r($features);

    echo '<br><br>' . $features->{'energy'} . '<br><br>';

    $meusDados = $api->me();
    print_r($meusDados);

    echo '<br><br>';

    listUserPlaylists($api, $meusDados->{'id'});
} else {
    $options = [
        'scope' => [
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-top-read',
            'user-read-recently-played',

            'playlist-read-private',
        ],
    ];

    header('Location: ' . $session->getAuthorizeUrl($options));
    die();
}