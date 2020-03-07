<?php
require '../vendor/autoload.php';

session_start();

//Guardar API do utilizadr loggado na sessão

$api = $_SESSION['api_obj'];

//Guardar dados do utilizador loggado

$user = $api->me();
$userFile = "user.json";
$userData = json_encode($user);

$_SESSION['userData'] = $userData;

file_put_contents($userFile, $userData);

header('Location: ../options.php');