<?php
require '../vendor/autoload.php';

$session = new SpotifyWebAPI\Session(
    'de8b0fa92d7a421da94cd48858522a77',
    'a713fdaaef5347ae801749567d4e82e8',
    'http://localhost/Projeto4-MI/php/loginSpotify.php'
);

$api = new SpotifyWebAPI\SpotifyWebAPI();

if (isset($_GET['code'])) { //Se já autorizou, já tem acesso
    session_start();

    $session->requestAccessToken($_GET['code']);
    $api->setAccessToken($session->getAccessToken()); //verifica e define o token de acesso

    $_SESSION['api_obj'] = $api;

    header('Location: getUserInfo.php');
} else { //se ainda não autorizou
    $options = [
        'scope' => [
            'user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-top-read',
            'user-read-recently-played',

            'playlist-read-private',
            'playlist-modify-public'
        ],
    ];

    header('Location: ' . $session->getAuthorizeUrl($options)); //manda para a pagina de autorização
    die();
}