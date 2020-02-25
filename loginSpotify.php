<?php
require 'vendor/autoload.php';
include_once "getTracks.php";


$session = new SpotifyWebAPI\Session(
    'de8b0fa92d7a421da94cd48858522a77',
    'a713fdaaef5347ae801749567d4e82e8',
    'http://localhost/P4/loginSpotify.php'
);

$api = new SpotifyWebAPI\SpotifyWebAPI();

if (isset($_GET['code'])) {
    $session->requestAccessToken($_GET['code']);
    $api->setAccessToken($session->getAccessToken());

    getTracks($api);

    print_r($api->me());
} else {
    $options = [
        'scope' => [
            'user-read-email',
        ],
    ];

    header('Location: ' . $session->getAuthorizeUrl($options));
    die();
}